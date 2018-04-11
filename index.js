/*
* @Author: wrma
* @Date: 2018/4/8
* @Last Modified by:   wrma
* @Last Modified time: 10:00
*/
;(function (window,document) {
    var Datepicker = function Datepicker(option) {
        this.option= option;
        this.$datePickerContainer = this.__createContainer(); //盛放datepicker_wrap和input元素的容器
        this.$datePickerInput = this.__createInputEle(); //input元素
        this.__bindInputfocus(this.$datePickerInput); //给input元素绑定点击事件
    }
    Datepicker.prototype = {
        constructor : Datepicker,
        defaultOption : {
            yearRange : 10
        },
        template : {
            head : {
                years : ''+
                '        <div class="date-picker_head">'+
                '            <select class="date-picker-years_select">'+
                '               <%= yearsHtml %>'+
                '            </select>',
                month : ''+
                '            <select class="date-picker-month_select">'+
                '               <%= monthHtml %>'+
                '            </select>'+
                '        </div>'
            },
            body : ''+'<div class="date-picker_body">'+
                '            <table>'+
                '                <thead>'+
                '                    <tr>'+
                '                        <td>日</td>'+
                '                        <td>一</td>'+
                '                        <td>二</td>'+
                '                        <td>三</td>'+
                '                        <td>四</td>'+
                '                        <td>五</td>'+
                '                        <td>六</td>'+
                '                    </tr>'+
                '                </thead>'+
                '                <tbody>'+
                '                   <%= daysHtml %>'+
                '                </tbody>'+
                '            </table>'+
                '        </div>'
        },
        //模板正则，用于匹配模板字符串
        templateReplaceReg : /<%=.*(\w+).*%>/g,
        //编译模板，替换数据
        __compileHtml : function (template,data) {
            var compiledTemplate = template.replace(this.templateReplaceReg,data);
            return compiledTemplate;
        },
        //初始化
        __init : function () {
            this.__setInitialDate();
            this.__renderHtml(this.__currentDate);
            this.__bindEvent(this.__currentDate);
        },
        //设置初始日期
        __setInitialDate : function () {
            if (this.option.startDate){
                this.__currentDate = new Date(this.option.startDate);
            }
            else{
                this.__currentDate = new Date();
            }
            this.year = this.__currentDate.getFullYear();
            this.month = this.__currentDate.getMonth();
        },
        __renderHtml : function (date) {
            var template = this.__compileHtml(this.template.head.years,this.__getYearsHtml(this.__currentDate))
                        +this.__compileHtml(this.template.head.month,this.__getMonthHtml(this.__currentDate))
                        + this.__compileHtml(this.template.body,this.__getDaysHtml(this.__currentDate));
            var $wrap = document.createElement('div');
            $wrap.setAttribute('class','date-picker_wrap');
            this.$datePickerContainer.insertBefore($wrap,this.$datePickerInput);
            $wrap.innerHTML = template;
        },
        //创建包裹input和datepicker组件的容器
        __createContainer : function () {
            var $parentContainer = this.option.container;
            var $datePickerContainer = document.createElement('div');
            $parentContainer.appendChild($datePickerContainer);
            $datePickerContainer.setAttribute('class','date-picker_container');
            return $datePickerContainer;
        },
        //创建input元素
        __createInputEle : function () {
            var $datePickerContainer = this.option.container.firstChild;
            var $datePickerInput = document.createElement('input');
            $datePickerContainer.appendChild($datePickerInput);
            $datePickerContainer.firstChild.setAttribute('class','date-picker-input');
            $datePickerContainer.firstChild.setAttribute('readonly','readonly');
            return $datePickerInput;
        },
        __bindInputfocus : function ($inputEle) {
            var _this = this;
            var isFirstRender = true;   //用于判断是否为第一次渲染
            $inputEle.addEventListener('focus',function () {
                if (isFirstRender){
                    _this.__init();
                    isFirstRender = false;
                }
                else{
                    document.querySelector('.date-picker_wrap').classList.remove('hide');
                }
            })
        },
        __updateDayHtml : function (date) {
            var $bodyWrap = document.querySelector('.date-picker_body');
            $bodyWrap.innerHTML = this.__compileHtml(this.template.body,this.__getDaysHtml(date));
            this.__bindDaySelect();
        },
        //月份选中，重新渲染日期部分
        __bindMonthSelect : function () {
            var _this = this;
            var $monthSelect = document.querySelector('.date-picker-month_select');
            $monthSelect.addEventListener('change',function (e) {
                _this.month = this.value;
                _this.__currentDate.setMonth(_this.month);
                _this.__updateDayHtml(_this.__currentDate);
                // __renderHtml(year,month);
            });
        },
        //年份选中，重新渲染日期部分
        __bindYearSelect : function () {
            var _this = this;
            var $yearSelect = document.querySelector('.date-picker-years_select');
            $yearSelect.addEventListener('change',function (e) {
                _this.year = this.value;
                _this.__currentDate.setFullYear(_this.year);
                _this.__updateDayHtml(_this.__currentDate);
            });
        },
        //日期选中
        __bindDaySelect : function () {
            var _this = this;
            var $datePickerWrap = document.querySelector('.date-picker_wrap');
            var $dayTableBody = document.querySelector('table').querySelector('tbody');
            var $dayCell = $dayTableBody.querySelectorAll('td:not([class="old-day"])');
            //日期选中
            $dayTableBody.addEventListener('click',function (e) {
                if (e.target.nodeName.toLowerCase() === 'td'){
                    if (e.target.className !== 'old-day') {
                        //清除
                        $dayCell.forEach(function (item,index) {
                            item.classList.remove('active');
                        });
                        e.target.classList.add('active');
                        _this.day = e.target.innerHTML;
                        $datePickerWrap.classList.add('hide');
                    }
                    else{
                        return;
                    }
                }
                _this.$datePickerInput.value = _this.year +'年'+ (parseInt(_this.month)+1) +'月'+ _this.day + '日';
            })
        },
        __bindEvent : function () {
            this.__bindMonthSelect();
            this.__bindYearSelect();
            this.__bindDaySelect();
        },
        __getYearsHtml : function (date) {
            var html = '';
            var currentYear = date.getFullYear();
            //获取当前年份下之后10年
            for(var i = this.option.yearRange;i>0;i--){
                html+='<option value="'+(currentYear+i)+'">'+(currentYear+i)+'</option>'
            }
            html+='<option value="'+currentYear+'" selected="selected">'+currentYear+'</option>'
            //获取当前年份下之前10年
            for(var i = 1;i<this.option.yearRange+1;i++){
                html+='<option value="'+(currentYear-i)+'">'+(currentYear-i)+'</option>'
            }
            return html;
        },
        __getMonthHtml : function (date) {
            var html = '';
            var currentMonth = date.getMonth();
            var monthArr = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
            // 获取当前月份并渲染出剩余月份
            for(var i = 0;i<12;i++){
                if (currentMonth === i){
                    html += '<option value="'+ i +'" selected = "selected">'+monthArr[i]+'</option>';
                }
                else{
                    html += '<option value="'+ i +'">'+monthArr[i]+'</option>';
                }
            }
            return html;
        },
        __getDateArrayOfMounth : function (date) {
            var dateArr = [];
            var currentYear = date.getFullYear();
            var currentMonth = date.getMonth();

            //获取当前月的第一天和它所在的星期
            var currentMonthDay = new Date(currentYear,currentMonth,1);
            var currentMonthDayWeek = currentMonthDay.getDay();//0

            //获取上一月的最后一天和它所在的星期
            var prevMonthDay = new Date(currentYear,currentMonth,0);
            var prevMonthDayDate = prevMonthDay.getDate();//31
            var prevMonthDayWeek = prevMonthDay.getDay();//6

            //获取当前月的最后一天和它所在的星期
            var lastMonthDay = new Date(currentYear,currentMonth+1,0);
            var lastMonthDayDate = lastMonthDay.getDate();//1
            var lastMonthDayWeek = lastMonthDay.getDay();//0

            //6行7列
            for (var i = 0;i<6*7;i++){
                var prevMonthDayCount = i-prevMonthDayWeek+1;
                //上一月
                if (prevMonthDayCount <= 0){
                    dateArr.push({
                        month : currentMonth,
                        date : prevMonthDayDate-prevMonthDayWeek+i+1
                    })
                }
                //当月
                else if(prevMonthDayCount > 0 && i<lastMonthDayDate+prevMonthDayWeek){
                    dateArr.push({
                        month : currentMonth+1,
                        date : i-prevMonthDayWeek+1
                    })
                }
                //下一月
                else{
                    dateArr.push({
                        month : currentMonth+2,
                        date : i-lastMonthDayDate-prevMonthDayWeek+1
                    })
                }
            }
            return dateArr;
        },
        __getDaysHtml : function (date) {
            var html = '';
            var currentMonth = date.getMonth();
            var dateArr = this.__getDateArrayOfMounth(this.__currentDate);
            for (var i = 0;i<dateArr.length;i++){
                if (i % 7 === 0){
                    html += '<tr>';
                }
                if ( dateArr[i].month === currentMonth + 1){
                    if (dateArr[i].date === date.getDate())
                        html += '<td class="today">'+  dateArr[i].date +'</td>';
                    else
                        html += '<td>'+  dateArr[i].date +'</td>';
                }
                else{
                    html += '<td class="old-day">'+  dateArr[i].date +'</td>';
                }
                if (i % 7 === 6){
                    html += '</tr>';
                }
            }
            return html;
        },
    }
    window.DatePicker = Datepicker;
}(window,document));