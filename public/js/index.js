// const store=require('store');
; (function () {
    // console.log(jQuery,$);
    'use strict';
    let task_list = [];

    function init() {
        store.clear();
        // if (store.get('task_list')) {
        //     task_list = store.get('task_list');
        // }
        task_list = store.get('task_list') || [];
        // task_list = store.get('task_list');
        // console.log(task_list);
        render_task_list();
    }

    function add_task(new_task) {
        task_list.push(new_task);
        // console.log('task_list:', task_list)
        update_task_list();
        // store.set('task_list', task_list);
        // console.log('task_list:', task_list);
        // console.log(store)
        console.log(task_list);
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
        // if (task_list.length !== 0) {
        // console.log(task_list)
        listen_task_delete();
        listen_task_detail();
        // }

        // console.log($delete_task);

        // $delete_task=$('.delete');
        // console.log($delete_task);
    }
    function listen_task_delete() {
        $('.action.delete').on('click', function () {
            let $item = $(this).parent().parent();
            let index = $item.data('index');
            // console.log($item.data('index'));
            confirm('确定删除？') ? delete_task(index) : null;
        })
    }
    function listen_task_detail() {
        $('.action.detail').on('click', function (e) {
            e.stopPropagation();
            let $item = $(this).parent().parent();
            let index = $item.data('index');
            console.log(index);
            show_task_detail(index);
        })
    }
    function show_task_detail(index) {
        // $('.task-detail-mask').css({ display: "block" });
        // $('.task-detail').css({ display: "block" });
        render_task_detail(index);
        $('.task-detail').show();
        $('.task-detail-mask').show();
    }
    //渲染指定task的详细信息
    function render_task_detail(index){
        if(index===undefined||task_list[index]===undefined) return;
        let task_detail_tpl=`
        <div class="content">${task_list[index].content}</div>
            <div>
                <div class="desc">
                    <textarea width=40 height=50></textarea>
                </div>
            </div>
            <div class="remind">
                <input type="date">
                <button type='submit'>submit</button>
        </div>`;
        $('.task-detail').html(task_detail_tpl);
    }
    $('html').on('click', function () {
        // $('.task-detail').css({ display: "none" });
        // $('.task-detail-mask').css({ display: "none" });
        $('.task-detail').hide();
        $('.task-detail-mask').hide();
    })
    $('.task-detail').on('click', function (e) {
        e.stopPropagation();
    })
    function render_task_item(data, i) {
        let list_item_tpl = `
            <li class="task-item" data-index=${i}>
                <span> <input type="checkbox"></span>
                <span class="task-content">${data.content}</span>
                <div class='fr'>
                    <span class='action detail'>详情</span>
                    <span class='action delete'>删除</span>
                </div>
            </li>`;
        // return $(list_item_tpl);
        return list_item_tpl;
    }

    function delete_task(index) {
        console.log(task_list);
        if (index === undefined || !task_list[index]) return;
        delete task_list[index];
        update_task_list()
    }

    function update_task_list() {
        store.set('task_list', task_list)
        render_task_list();
    }

    init();

    $('.add-task').on('submit', function (e) {
        let new_task = {};
        e.preventDefault();
        new_task.content = $(this).find('input[name=content]').val();
        $(this).find('input[name=content]').val("")
        $('.add-task>input').focus()
        if (!new_task.content) return;
        // console.log('new_task:', new_task)
        // console.log('task_list:', task_list)
        // setTimeout(()=>{
        //     add_task(new_task);
        // },3000)

        // console.log('task_list:', task_list)
        add_task(new_task);
        // render_task_list(); 
    })

})();