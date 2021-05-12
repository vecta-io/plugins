//https://github.com/vecta-io/plugins/blob/main/plugin_22.js

//Pipe generator

//The svg icon for a corner pipe
var corner = '<svg width="52" height="52" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><defs><linearGradient id="A" x1="45%" y1="0%" x2="55%" y2="100%"><stop offset="0%" stop-color="gray"/><stop offset="50%" stop-color="#fff"/><stop offset="100%" stop-color="gray"/></linearGradient></defs><g id="pipe_corner.sym" transform="translate(0)" fill="url(#A)" stroke="none"><path d="M0 50c5.5365 0 10.8571-.8918 15.8267-2.5402L6.3307 18.991C4.3428 19.6504 2.2146 20.0071 0 20.0071z"/><path d="M0 31.0065c5.5369 0 10.858-.8917 15.828-2.54L6.3312 0C4.3432.6593 2.2148 1.016 0 1.016z" transform="matrix(.95164803 -.30719053 .30719053 .95164803 5.82579054 18.07372089)"/><path d="M0 31.0041c5.5374 0 10.8588-.8917 15.8292-2.5398L6.3317 0C4.3435.6593 2.2149 1.0159 0 1.0159z" transform="matrix(.81126796 -.58467452 .58467452 .81126796 11.08901414 15.4098891)"/><path d="M0 31.0016c5.5378 0 10.8597-.8916 15.8305-2.5396L6.3322 0C4.3439.6592 2.2151 1.0158 0 1.0158z" transform="matrix(.59243508 -.80561819 .80561819 .59243508 15.2807721 11.256992)"/><path d="M0 30.9991c5.5382 0 10.8605-.8915 15.8318-2.5394L6.3327 0C4.3442.6592 2.2153 1.0158 0 1.0158z" transform="matrix(.3163114 -.94865542 .94865542 .3163114 17.9955311 6.01606122)"/></g></svg>',
    //svg icon for a T type join pipe
    join = '<svg width="52" height="52" viewBox="0 0 76 76" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><defs><linearGradient id="B" x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stop-color="gray"/><stop offset="50%" stop-color="#fff"/><stop offset="100%" stop-color="gray"/></linearGradient></defs><g id="pipe_join.sym" stroke="none" transform="translate(0.5 12.5)"><path fill="url(#A)" d="M.5 25.5h75v25H.5z"/><path d="M50.5 25.5L38 38 25.5 25.5V.5h25z" fill="url(#B)"/></g></svg>',
    //svg icon for a cross type pipe
    cross = '<svg width="51" height="51" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><g transform="translate(0.5 0.5)" stroke="none"><path fill="url(#A)" d="M.5 17.8751h50v15H.5z"/><path d="M18 50.5V33l7.5-7.5L33 33v17.5z" fill="url(#B)"/><path d="M15 25V7.5L7.5 0 0 7.5V25z" fill="url(#B)" transform="matrix(-1 0 0 -1 33 25.5)"/></g></svg>';

Vecta.dialog({
    title: 'Pipe generator',
    content: [
        {type: 'html', html: '<label>Choose a style:</label>'},
        //Insert the style buttons
        {type: 'html', style: 'width: 400px; display: flex; justify-content: space-between; flex-wrap: wrap;',
         	html: '<button class="StyleButton.cls Selected.cls" style="margin: 0 0 15px 35px; background-color: #b6dcfb; padding: 10px; height: 72px;">' + corner + '</button>' +
                '<button class="StyleButton.cls" style="margin: 0 0 15px; background-color: transparent; padding: 10px; height: 72px;">' + 
                    '<svg width="52" height="52"><use xlink:href="#pipe_corner.sym" transform="rotate(90 26 26)" /></svg>' +
                '</button>' +
                '<button class="StyleButton.cls" style="margin: 0 0 15px; background-color: transparent; padding: 10px; height: 72px;">' + 
                    '<svg width="52" height="52"><use xlink:href="#pipe_corner.sym" transform="rotate(180 26 26)" /></svg>' +
                '</button>' + 
                '<button class="StyleButton.cls" style="margin: 0 35px 15px 0; background-color: transparent; padding: 10px; height: 72px;">' + 
                    '<svg width="52" height="52"><use xlink:href="#pipe_corner.sym" transform="rotate(270 26 26)" /></svg>' +
                '</button>' +
        		'<button class="StyleButton.cls" style="margin: 0 0 5px; background-color: transparent; padding: 10px; height: 72px;">' + join + '</button>' +
                '<button class="StyleButton.cls" style="margin: 0 0 5px; background-color: transparent; padding: 10px; height: 72px;">' + 
                    '<svg width="52" height="52" viewBox="0 0 76 76"><use xlink:href="#pipe_join.sym" transform="rotate(90 38 38)" /></svg>' +
                '</button>' +
        		'<button class="StyleButton.cls" style="margin: 0 0 5px; background-color: transparent; padding: 10px; height: 72px;">' + 
                    '<svg width="52" height="52" viewBox="0 0 76 76"><use xlink:href="#pipe_join.sym" transform="rotate(180 38 38)" /></svg>' +
                '</button>' +
        		'<button class="StyleButton.cls" style="margin: 0 0 5px; background-color: transparent; padding: 10px; height: 72px;">' + 
                    '<svg width="52" height="52" viewBox="0 0 76 76"><use xlink:href="#pipe_join.sym" transform="rotate(270 38 38)" /></svg>' +
                '</button>' +
        		'<button class="StyleButton.cls" style="margin: 0 0 5px; background-color: transparent; padding: 10px; height: 72px;">' + cross + '</button>'},
        //Insert size and thickness number inputs
        {type: 'html', style: 'display: flex; justify-content: space-between',
         	html: '<div><label>Size:</label><input type="number" value="50" min="0" id="pipe_size.id" style="width: 178px;" /></div>' +
         		'<div><label>Thickness:</label><input type="number" value="30" min="0" id="pipe_thickness.id" style="width: 178px;" /></div>'},
        //Insert the help message that size must be larger than or equals to (thickness + 1)
        {type: 'html', html: '<div class="Help.cls">The size must be larger than thickness.</div>'},
        //Insert the gradient color inputs
        {type: 'html', style: 'display: flex; justify-content: space-between',
         	html: '<div><label>Gradient #1:</label><input type="text" value="#808080" id="grad_start.id" style="width: 110px;" /></div>' +
            	'<div><label>Gradient #2:</label><input type="text" value="#ffffff" id="grad_mid.id" style="width: 110px;" /></div>' +
        		'<div><label>Gradient #3:</label><input type="text" value="#808080" id="grad_stop.id" style="width: 110px;" /></div>'}
    ],
    buttons: [
        { label: 'Generate', default: true },
        { label: 'Cancel', cancel: true}
    ],
    click: function (evt) {
        
        if (evt.$target.hasClass('StyleButton.cls')) {
            //Clear all buttons of highlights
            evt.$dialog.find('.StyleButton\\.cls').removeClass('Selected.cls').css('background-color', 'transparent'); 

            //set the button being clicked as highlighted
            evt.$target.addClass('Selected.cls').css('background-color', '#b6dcfb'); 

            //If the style is corners, set the default size to 50 otherwise set to 70
            if (evt.$dialog.find('.Selected\\.cls').index() < 4 ) { evt.$dialog.find('#pipe_size\\.id').val(50); }
            else { evt.$dialog.find('#pipe_size\\.id').val(70); }
        }
        
        
    },
    valid: function ($input) {
    	var $input2,
        	size,
            thick,
            color;
        
        switch ($input.attr('id')) {
            //check when the pipe size value is changed
            case 'pipe_size.id':
                //get the pipe size value and pipe thickness value, parse to float so that both values can be compared
                $input2 = $('#pipe_thickness\\.id');
                
                return validateSizeThick(parseFloat($input.val()), parseFloat($input2.val()), $input2);
            //check when the pipe thickness value is changed
            case 'pipe_thickness.id':
                $input2 = $('#pipe_size\\.id');
                
                return validateSizeThick(parseFloat($input2.val()), parseFloat($input.val()), $input2);
            //check when the gradients value is changed
            case 'grad_start.id':
            case 'grad_mid.id':
          	case 'grad_stop.id':
                //if color is in hex6 or hex3 format, then it is valid
                return Vecta.valid.color($input.val());
        }
        
        return true;
        
        function validateSizeThick(size, thick, $input2) {
            //if size is less than (thickness + 1) or size field is empty, it is invalid
            if (isNaN(size) || isNaN(thick) || size < (thick + 1)) {                 
                return false;
            }
            else {

                if ($input2.hasClass('Invalid.cls')) {
                    $input2.removeClass('Invalid.cls');
                    $input2.parent().removeClass('Invalid.cls');
                }
                
                return true;
            }
        }
    },
    close: function (evt) {
        //get the index of the style button which determines what style of the pipe we want to generate
        var style = evt.$dialog.find('.Selected\\.cls').index(),
            size,
            thick,
            colors;
        
        //If user click on the generate buttton and not the cancel button
        if (evt.$target.hasClass('Default.cls')) {
            size = parseFloat(evt.$dialog.find('#pipe_size\\.id').val());
            thick = parseFloat(evt.$dialog.find('#pipe_thickness\\.id').val());
            colors = {
                start: evt.$dialog.find('#grad_start\\.id').val(),
                mid: evt.$dialog.find('#grad_mid\\.id').val(),
                stop: evt.$dialog.find('#grad_stop\\.id').val()
            };
                        
            //if corner pipe, generate that, otherwise generate join or cross pipe
            if (style < 4) { createCorner(style, size, thick, colors); }
            else { createJoin(style, size, thick, colors); }
        }

        function createJoin(style, size, thick, colors) {
            var shapes,
                group;
            
            //Create the longer pipe
            shapes = [
                new Vecta.activePage.drawRect(0, (size - thick) * 0.5, size, thick)
                    .fill(new Vecta.linearGradient({stops: [{color: colors.start}, {color: colors.mid}, {color: colors.stop}], angle: 0}).url())
                    .stroke('none')
            ];
            
            //If it is a cross
            if (style === 8) {
                
                //Create the cross pipe
                shapes.push(new Vecta.activePage.drawPath([
                    {type: 'M', x: (size - thick) * 0.5, y: 0},
                    {type: 'L', x: (size - thick) * 0.5 + thick, y: 0},
                    {type: 'L', x: (size - thick) * 0.5 + thick, y: (size - thick) * 0.5},
                    {type: 'L', x: size * 0.5, y: (size - thick) * 0.5 + thick * 0.5},
                    {type: 'L', x: (size - thick) * 0.5 + thick, y: (size - thick) * 0.5 + thick},
                    {type: 'L', x: (size - thick) * 0.5 + thick, y: size},
                    {type: 'L', x: (size - thick) * 0.5, y: size},
                    {type: 'L', x: (size - thick) * 0.5, y: (size - thick) * 0.5 + thick},
                    {type: 'L', x: size * 0.5, y: (size - thick) * 0.5 + thick * 0.5},
                    {type: 'L', x: (size - thick) * 0.5, y: (size - thick) * 0.5},
                    {type: 'Z'}
                ]).fill(new Vecta.linearGradient({stops: [{color: colors.start}, {color: colors.mid}, {color: colors.stop}], angle: 90}).url()).stroke('none'));
            }
            else {
                
                //Create a half cross or join pipe
                shapes.push(new Vecta.activePage.drawPath([
                    {type: 'M', x: (size - thick) * 0.5, y: 0},
                    {type: 'L', x: (size - thick) * 0.5 + thick, y: 0},
                    {type: 'L', x: (size - thick) * 0.5 + thick, y: (size - thick) * 0.5},
                    {type: 'L', x: size * 0.5, y: (size - thick) * 0.5 + thick * 0.5},
                    {type: 'L', x: (size - thick) * 0.5, y: (size - thick) * 0.5},
                    {type: 'Z'}
                ]).fill(new Vecta.linearGradient({stops: [{color: colors.start}, {color: colors.mid}, {color: colors.stop}], angle: 90}).url()).stroke('none'));
            }
            
            //Group both together
            group = new Vecta.Selection(shapes).group();
            
            //Rotate the result depending on the style
            if (style !== 8) { group.angle(90 * (style - 4)); }
            
            //Clear all selection and create a new one
            Vecta.selection.clear().add(group);
        }
        
        //Generate corner pipes
        function createCorner(style, size, thick, colors) {
            //draw the inner circle
            var inner = Vecta.activePage.drawEllipse(thick, thick, (size - thick) * 2, (size - thick) * 2),
                //draw the outer circle
                outer = Vecta.activePage.drawEllipse(0, 0, size * 2, size * 2),
                //draw the cutter lines which is a 90 degree lower right bottom part of the circle
                cutter = Vecta.activePage.drawPath([
                	{type: 'M', x: size * 2, y: size},
                	{type: 'L', x: size, y: size},
                	{type: 'L', x: size, y: size * 2}
            	]);
            
            //Trim all the shapes to get what we want
            new Vecta.Selection([inner, outer, cutter]).trim().then(function (shapes) {
                var i = 0,
                    inners,
                    outers;

                //Delete unnecessary shapes and filter out those deleted shapes
                shapes = shapes.filter(function (shape) {
                    
                    //delete outer
                    if (shape.xU() === 0 || 
                        //delete inner
                        shape.xU() === thick || 
                        //delete L shape straight line
                        shape.pathList().length === 3 ||
                        //delete the straight lines
                        shape.pathList()[1].type === 'L') { 
                        
                        shape.delete();
                        
                        return false;
                    }
                    
                    return true;
                });

                //Get the inner path
                inner = shapes.filter(function (shape) { return shape.widthU() === size - thick; })[0];
                
                //Get the outer path
                outer = shapes.filter(function (shape) { return shape.widthU() === size; })[0];
            
                //Convert the corner into 20% or 0.2, as we want to have 5 segments
                inners = Vecta.math.splitSegment(inner.pathList(), 0.2);
                outers = Vecta.math.splitSegment(outer.pathList(), 0.2);    
        
                //Create a 20% segment pie
                new Vecta.Selection([
                    Vecta.activePage.drawPath([inners[0][0], inners[0][1]]),
                    Vecta.activePage.drawPath([{type: 'M', x: inners[0][1].x, y: inners[0][1].y}, {type: 'L', x: outers[0][1].x, y: outers[0][1].y}]),
                    Vecta.activePage.drawPath([outers[0][0], outers[0][1]]),
                    Vecta.activePage.drawPath([{type: 'M', x: inners[0][0].x, y: inners[0][0].y}, {type: 'L', x: outers[0][0].x, y: outers[0][0].y}]),
                ]).join().then(function (res) {
                    var i = 0,
                        shapes = [res],
                        group,
                        index;

                    //move the resulting pie into position
                    res.move(res.xU() + size, res.yU() + size);

                    //remove unused shapes
                    inner.delete();
                    outer.delete();

                    for (; i < 4; i++) {

                        //require small adjustment to ensure generated shape is square
                        duplicate(shapes, res, (i + 1) * (89.45 * 0.2)); //90 / 5  = 18 degrees
                    }

                    //For each of the 5 pie, we need to set stroke and fill, with slightly differing gradient angles
                    shapes.forEach(function (shape) {
                        var grad = new Vecta.linearGradient({stops: [{color: colors.start}, {color: colors.mid}, {color: colors.stop}], angle: -4.5});

                        shape.fill(grad.url()).stroke('none');
                    });

                    //Adjust the size to ensure our shape fits into the size as calculations create a slightly bigger/smaller size
                    group = new Vecta.Selection(shapes).group().size(size, size);

                    //Rotate the result if the style being selected is rotated
                    group.angle(style * 90);

                    //Deselect all selection and create a new selection
                    Vecta.selection.clear().add(group);

                    //For each pie, we create a dummy and group them, then rotate them so we have 5 pies that makes up a corner
                    function duplicate(shapes, res, deg) {
                        //Create a duplicate
                        var dup = Vecta.activePage.drawPath(res.pathList()).move(res.xU(), res.yU()),
                            //Create a dummy shape opposite
                            dummy = Vecta.activePage.drawPath(res.pathList()).move(size - res.widthU()),
                            //Group both together
                            group = new Vecta.Selection([dup, dummy]).group();

                        //Rotate the group
                        group.angle(0 - deg);

                        //Ungroup because we want to get the duplicate and remove the dummy
                        group = new Vecta.Selection(group).ungroup();

                        //Remove the dummy
                        group[1].delete();

                        //get the duplicate shape
                        shapes.push(group[0]);
                    }
                });

            });
        }
    }
});