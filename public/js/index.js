// const store=require('store');
; (function () {
    // console.log(jQuery,$);
    'use strict';
    let task_list = [];
    let currentIndex = 0;
    function init() {
        // store.clear();
        // if (store.get('task_list')) {
        //     task_list = store.get('task_list');
        // }
        task_list = store.get('task_list') || [];
        // task_list = store.get('task_list');
        // console.log(task_list);
        render_task_list();
        task_remind_check();
    }

    function task_remind_check() {
        setInterval(function () {
            // console.log(task_list.length);
            if(task_list.length) return;
            for (let i = 0; i < task_list.length; i++) {
                if (task_list[i]) {
                    if (task_list[i].isCompleted || !task_list[i].date || task_list[i].informed) continue;
                    let stamp = (new Date()).getTime() - (new Date(task_list[i].date)).getTime();
                    // console.log(stamp);
                    if (stamp > 1) {
                        update_task(i, { informed: true });
                        show_msg(task_list[i].title);
                        // console.log('here');
                        $('.notify-delete').on('click', function (e) {
                            e.stopPropagation();
                            $(this).parent().fadeOut();
                            $(this).parent().remove();
                        })
                    }
                }
            }
        }, 1000)
    }
    function update_task(i, obj) {
        Object.assign(task_list[i], obj);
        // console.log(task_list[i]);
        store.set('task_list', task_list);
    }
    function show_msg(data) {
        let container_width = $('.container').width();
        let left_width = ($('body').width() - container_width) / 2;
        $('.notify').css({ width: container_width, left: left_width })
        // console.log(left_width);
        $('.notify').prepend(`
            <div id='notify' class='notify-item'>
                <span>${data}</span>
                <span class='notify-delete'>删除</span>
                <span class='notify-text'>亲，时间到了哦~</span>
            </div>
        `);
        $('.notify-item').fadeIn()
    }
    function render_task_list() {
        let $task_list = $('.task-list');
        $task_list.html('');
        // $task_list.children('li').remove();
        // console.log($task_list);
        // console.log(task_list);
        for (let i = 0; i < task_list.length; i++) {
            if (task_list[i]) {
                let task = render_task_item(task_list[i], i);
                // console.log(task);
                $task_list.append(task);
                // console.log($task_list)
            }
        }
        listen_task_delete();
        listen_task_detail();
        listen_task_dbclick();
        listen_task_complete();

    }
    function listen_task_complete() {
        $('.complete').on('click', function (e) {
            e.stopPropagation();
            // console.log($(this).is(':checked'))
            let is_completed = $(this).is(':checked');
            let index = $(this).parent().parent().data('index');
            task_list[index].isCompleted = is_completed;
            let task = task_list.splice(index, 1);
            // console.log(index);
            if (is_completed) {
                task_list.push(task[0]);
                // console.log(task_list);
                // $('.complete:last').attr('checked',true);
            } else {
                task_list.unshift(task[0]);
            }
            // console.log(task[0].isCompleted)
            update_task_list();

        })
    }
    function render_task_item(data, i) {
        // console.log(data.isCompleted)
        let list_item_tpl = `
            <li class="task-item ${data.isCompleted ? 'completed' : ''}" data-index=${i}>
                <span> <input class='complete' type="checkbox" ${data.isCompleted ? 'checked' : null}></span>
                <span class="task-content">${data.title}</span>
                <div class='fr'>
                    <span class='action detail'>详情</span>
                    <span class='action delete'>删除</span>
                </div>
            </li>`;
        // return $(list_item_tpl);
        return list_item_tpl;
    }
    function listen_task_delete() {
        $('.action.delete').on('click', function (e) {
            e.stopPropagation();
            let $item = $(this).parent().parent();
            let index = $item.data('index');
            // console.log($item.data('index'));
            // confirm('确定删除？') ? delete_task(index) : null;
            _confirm(delete_task.bind(null, index));
        })
    }
    function listen_task_detail() {
        $('.action.detail').on('click', function (e) {
            e.stopPropagation();
            let $item = $(this).parent().parent();
            let index = $item.data('index');
            // console.log(index);
            show_task_detail(index);
        })
    }
    function listen_task_dbclick() {
        $('.task-item').on('dblclick', function () {
            let index = $(this).data('index');
            // console.log(index);
            show_task_detail(index);
        })
    }
    function delete_task(index) {
        // console.log(task_list);
        if (index === undefined) return;
        task_list.splice(index, 1);
        update_task_list()
    }

    function update_task_list() {
        store.set('task_list', task_list)
        render_task_list();
    }

    function show_task_detail(index) {
        currentIndex = index;
        // $('.task-detail-mask').css({ display: "block" });
        // $('.task-detail').css({ display: "block" });
        let right_width = ($('body').width() - $('.container').width()) / 2;
        $('.task-detail-mask').show();
        $('.task-detail').css({ right: right_width }).show();
        render_task_detail(index);
    }

    //渲染指定task的详细信息
    function render_task_detail(index) {
        if (index === undefined || task_list[index] === undefined) return;
        let task_detail_tpl = `
        <input class="content" value="${task_list[index].title}">
        <textarea class='desc'>${task_list[index].text}</textarea>
        <div class="remind">
            <input id='datetimepicker' class='date' type="text" value="${task_list[index].date}" placeholder='亲~，记得添加时间哦'>
            <button class='desc-submit' type='submit'>更新</button>
        </div>`;
        $('.task-detail').html(task_detail_tpl);
        // jQuery('#datetimepicker').datetimepicker();
        // console.log($('#datetimepicker'));
        $('#datetimepicker').datetimepicker();
        $('.desc').focus();
        $('.task-detail>.content').on('click', function (e) {
            e.stopPropagation();
            $(this).css({ borderColor: '#333' });
            task_list[index].title = $(this).val();
            // console.log(task_list[index]);
        })
        $('.desc-submit').on('click', function (e) {
            let title = $('.task-detail>.content').val();
            let text = $('.desc').val();
            let date = $('.remind>.date').val();
            let obj = { title, text, date };
            if (date !== task_list[index].date) {
                obj.informed = false;
            }
            // console.log(title + '\n' + text + '\n', date);
            // task_list[index] = { title, text, date }
            Object.assign(task_list[index], obj);
            // store.set('task_list', task_list)
            update_task_list();
        })
    }

    function add_task(new_task) {
        console.log(task_list);
        task_list.unshift(new_task);
        // console.log('task_list:', task_list)
          console.log('here');
        update_task_list();
        // store.set('task_list', task_list);
        // console.log('task_list:', task_list);
        // console.log(store)
        // console.log(task_list);
    }
    init();
    $('.add-task').on('submit', function (e) {
        e.preventDefault();
        let new_task = {
            title: '',
            text: '',
            date: '',
            isCompleted: false
        }
        new_task.title = $(this).find('input[name=content]').val().trim();

        $(this).find('input[name=content]').val("")
        $('.add-task>input').focus()
        if (!new_task.title) return;
        // console.log('new_task:', new_task)
        // console.log('task_list:', task_list)
        // setTimeout(()=>{
        //     add_task(new_task);
        // },3000)

        // console.log('task_list:', task_list)
        add_task(new_task);
        // render_task_list(); 
    })
    $('html').on('click', function () {
        // $('.task-detail').css({ display: "none" });
        // $('.task-detail-mask').css({ display: "none" });
        $('.task-detail').hide();
        $('.task-detail-mask').hide();
        $('.confirm').hide();
    })
    $('.task-detail').on('click', function (e) {
        e.stopPropagation();
        $('.task-detail>.content').css({ borderColor: '#eee' })
    })
    $('.clear>.all').on('click', function (e) {
        e.stopPropagation();
        _confirm(delete_all);
    })
    $('.clear>.all-completed').on('click', function (e) {
        e.stopPropagation();
        _confirm(delete_completed);
    })
    $('.clear>.all-uncompleted').on('click', function (e) {
        e.stopPropagation();
        _confirm(delete_unCompleted);
    })
    function delete_all() {
        store.clear();
        task_list = [];
        render_task_list();
    }
    function delete_completed() {
        let i = task_list.length - 1;
        for (i; i >= 0; i--) {
            if (task_list[i].isCompleted) {
                task_list.splice(i, 1);
            }
        }
        update_task_list();
    }
    function delete_unCompleted() {
        let i = task_list.length - 1;
        for (i; i >= 0; i--) {
            if (!task_list[i].isCompleted) {
                task_list.splice(i, 1);
            }
        }
        update_task_list();
    }

    $(window).on('resize', function () {
        let container_width = $('.container').width();
        let offset_width = ($('body').width() - container_width) / 2;
        // console.log(container_width, left_width);
        $('.notify').css({ width: container_width, left: offset_width })
        $('.task-detail').css({ right: offset_width })
        $('.confirm').css({
            width: container_width * 0.6, left: offset_width + container_width * 0.2
        })
    })
    function _confirm(fn) {
        $('.task-detail-mask').show();
        let container_width = $('.container').width();
        let offset_width = ($('body').width() - container_width) / 2;
        $('.confirm').css({
            width: container_width * 0.6, left: offset_width + container_width * 0.2
        }).html(`
            <div class='del'>确认删除吗？</div>
            <div class='button'>
                <button>确认</button>
                <button>取消</button>
            </div>
        `).show();
        $('.confirm').on('click', function (e) {
            e.stopPropagation();
        })
        $('.confirm>.button>button').eq(0).on('click', function (e) {
            e.stopPropagation()
            fn();
            $('.confirm').hide();
            $('.task-detail-mask').hide();
        })
        $('.confirm>.button>button').eq(1).on('click', function (e) {
            e.stopPropagation()
            $('.confirm').hide();
            $('.task-detail-mask').hide();
        })
    }
})();