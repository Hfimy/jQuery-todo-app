// const store=require('store');
; (function () {
    // console.log(jQuery,$);
    'use strict';
    let $add_task = $('.add-task'),
        $delete_task,
        task_list = [];

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
        if (task_list.length !== 0) {
            // console.log(task_list)
            $delete_task = $('.delete');
            $delete_task.on('click', function () {
                let $item = $(this).parent().parent();
                let index = $item.data('index');
                // console.log($item.data('index'));
                confirm('确定删除？') ? delete_task(index) : null;
            })
        }
        // console.log($delete_task);

        // $delete_task=$('.delete');
        // console.log($delete_task);
    }

    function render_task_item(data, i) {
        let list_item_tpl = `
            <li class="task-item" data-index=${i}>
                <span> <input type="checkbox"></span>
                <span class="task-content">${data.content}</span>
                <div class='fr'>
                    <span class='action'>详情</span>
                    <span class='action delete'>删除</span>
                </div>
            </li>`;
        // return $(list_item_tpl);
        return list_item_tpl;
    }

    function delete_task(index) {
        console.log(task_list);
        if (index===undefined||!task_list[index]) return;
        delete task_list[index];
        update_task_list()
    }

    function update_task_list() {
        store.set('task_list', task_list)
        render_task_list();
    }
    init();

    $add_task.on('submit', function (e) {
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