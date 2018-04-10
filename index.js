/*
* @Author: wrma
* @Date: 2018/4/8
* @Last Modified by:   wrma
* @Last Modified time: 10:00
*/
;(function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day;
    var templateHead;
    var templateBody;
    var isFirstRender; //用于判断是否为第一次渲染
    var Datepicker = function Datepicker(option) {
        this.parentContainer = option.container;
        var _this = this;
        isFirstRender = true;
        var $datePickerContainer = document.createElement('div');
        this.parentContainer.appendChild($datePickerContainer);
        this.parentContainer.firstChild.setAttribute('class','date-picker_container');
        this.container = option.container.firstChild;
        var $datePickerInput = document.createElement('input');
        this.container.appendChild($datePickerInput);
        this.container.firstChild.setAttribute('class','date-picker-input');
        // console.log(this.container.firstChild);
        this.container.firstChild.addEventListener('focus',function () {
            if (isFirstRender){
                _this.renderHtml();
                _this.bindEvent();
                isFirstRender = false;
            }
            else{
                document.querySelector('.date-picker_wrap').classList.remove('hide');
            }
        })
    }
    Datepicker.prototype = {
        constructor : Datepicker,
        renderHtml : function (year,month) {
            //默认值为当前年月
            if ( !year || !month){
                currentYear = date.getFullYear();
                currentMonth = date.getMonth();
            }
            else{
                currentYear = year;
                currentMonth = month;
            }
            templateHead = ''+
                '        <div class="date-picker_head">'+
                '            <select class="date-picker-years_select">'+
                                this.getYearsHtml(currentYear)+
                '            </select>'+
                '            <select class="date-picker-month_select">'+
                                this.getMonthHtml(currentMonth)+
                '            </select>'+
                '        </div>';
            templateBody = '<div class="date-picker_body">'+
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
                                    this.getDaysHtml(currentYear,currentMonth)+
                '                </tbody>'+
                '            </table>'+
                '        </div>';
            var template = templateHead + templateBody;
            var $wrap = document.createElement('div');
            $wrap.setAttribute('class','date-picker_wrap');
            this.container.insertBefore($wrap,this.container.firstChild);
            $wrap.innerHTML = template;
        },
        updateDayHtml : function (year,month) {
            var _this = this;
            var $datePickerWrap = document.querySelector('.date-picker_wrap');
            //默认值为当前年月
            if ( !year || !month){
                currentYear = date.getFullYear();
                currentMonth = date.getMonth();
            }
            else{
                currentYear = year;
                currentMonth = month;
            }
            var $bodyWrap = document.querySelector('.date-picker_body');
            $bodyWrap.innerHTML = '<table>'+
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
                                    this.getDaysHtml(currentYear,currentMonth)+
                '                </tbody>'+
                '            </table>';
            var $dayTable = document.querySelector('table');
            var $dayCell = document.querySelectorAll('td');
            //日期选中
            $dayTable.addEventListener('click',function (e) {
                if (e.target.nodeName.toLowerCase() === 'td'){
                    if (e.target.className !== 'old-day') {
                        //清除
                        $dayCell.forEach(function (item,index) {
                            item.classList.remove('active');
                        });
                        e.target.classList.add('active');
                        day = e.target.innerHTML;
                        $datePickerWrap.classList.add('hide');
                    }
                    else{
                        return;
                    }
                }
                _this.container.lastChild.value = year +'年'+ (parseInt(month)+1) +'月'+ day + '日';
            })
        },
        bindEvent : function () {
            var $datePickerWrap = document.querySelector('.date-picker_wrap');
            var $monthSelect = document.querySelector('.date-picker-month_select');
            var $yearSelect = document.querySelector('.date-picker-years_select');
            var $dayTable = document.querySelector('table');
            var $dayCell = document.querySelectorAll('td:not([class="old-day"])');
            var _this = this;
            //月份选中，重新渲染日期部分
            $monthSelect.addEventListener('change',function (e) {
                month = this.value;
                _this.updateDayHtml(year,month);
                // renderHtml(year,month);
            });
            //年份选中，重新渲染日期部分
            $yearSelect.addEventListener('change',function (e) {
                year = this.value;
                _this.updateDayHtml(year,month);
            });
            //日期选中
            $dayTable.addEventListener('click',function (e) {
                if (e.target.nodeName.toLowerCase() === 'td'){
                    if (e.target.className !== 'old-day') {
                        //清除
                        $dayCell.forEach(function (item,index) {
                            item.classList.remove('active');
                        });
                        e.target.classList.add('active');
                        day = e.target.innerHTML;
                        $datePickerWrap.classList.add('hide');
                    }
                    else{
                        return;
                    }
                }
                _this.container.lastChild.value = year +'年'+ (month+1) +'月'+ day + '日';
            })
        },
        getYearsHtml : function (year) {
            var html = '';
            var currentYear = year;
            //获取当前年份下之前10年
            for(var i = 0;i<10;i++){
                html+='<option value="'+(currentYear-i)+'">'+(currentYear-i)+'</option>'
            }
            return html;
        },
        getMonthHtml : function (month) {
            var html = '';
            var currentMonth = month;
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
        getDaysHtml : function (year,month) {
            var html = '';
            var dateArr = [];
            var currentYear;
            var currentMonth;
            currentYear = year;
            currentMonth = month;
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
            for (var i = 0;i<dateArr.length;i++){
                if (i % 7 === 0){
                    html += '<tr>';
                }
                if ( dateArr[i].month === currentMonth + 1){
                    html += '<td>'+  dateArr[i].date +'</td>';
                }
                else{
                    html += '<td class="old-day">'+  dateArr[i].date +'</td>'
                }
                if (i % 7 === 6){
                    html += '</tr>';
                }
            }
            return html;
        }
    }
    window.DatePicker = Datepicker;
}());