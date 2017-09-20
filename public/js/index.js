// const store=require('store');
; (function () {
    // console.log(jQuery,$);
    'use strict';
    let $add_task = $('.add-task'),
        task_list = [];

    function init() {
        store.clear();
        // if (store.get('task_list')) {
        //     task_list = store.get('task_list');
        // }
        task_list=store.get('task_list')||[];
        // task_list = store.get('task_list');
        // console.log(task_list);
        render_task_list();
    }

    function add_task(new_task) {
        task_list.push(new_task);
        console.log('task_list:', task_list)
        store.set('task_list', task_list);
        // console.log('task_list:', task_list);
        // console.log(store)
    }

    function render_task_list() {

        let $task_list=$('.task-list');
        $task_list.html('');
        // $task_list.children('li').remove();
        // console.log($task_list);
        console.log(task_list);
        for(let i=0;i<task_list.length;i++){
            let task=render_task_item(task_list[i]);
            // console.log(task);
            $task_list.append(task);
            // console.log($task_list)
        }
    }

    function render_task_item(data) {
        let list_item_tpl = `
            <li class="task-item">
                <span> <input type="checkbox"></span>
                <span class="task-content">${data.content}</span>
                <div class='fr'>
                    <span class='action'>详情</span>
                    <span class='action'>删除</span>
                </div>
            </li>`;
        // return $(list_item_tpl);
        return list_item_tpl;
    }
    init();

    $add_task.on('submit', function (e) {
        let new_task = {};
        e.preventDefault();
        new_task.content = $(this).find('input[name=content]').val();
        $(this).find('input[name=content]').val("")
        $('.add-task>input').focus()
        if (!new_task.content) return;
        console.log('new_task:', new_task)
        console.log('task_list:', task_list)
        // setTimeout(()=>{
        //     add_task(new_task);
        // },3000)
        
        // console.log('task_list:', task_list)
        add_task(new_task);
        render_task_list();
        
    })

})();