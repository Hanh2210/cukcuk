$(document).ready(function () {
    setEvent();
    loadData(1);
    setTimeout(function () {
        getData();
    }, 500);

    $('select').change(function () {
        $('span').text('Không được bỏ trống');
    });
});

var status = "";
var employeeIdSelect = "";


//set sự kiện
function setEvent() {
    // Ẩn và hiển thị dialog
    $('.dialog').hide();
    $(".dialog-close").on('click', function () {
        $('.dialog').hide();
    });
    $(".cancel").on('click', function () {
        $('.dialog').hide();
    });


    //sự kiện click vào button để hiện ra dialog
    $(".addemployee").on('click', function () {
        status = 1;
        $('.dialog input').val("");
        $('.dialog select').val("");

        //focus vào mã khách hàng (EmployeeCode) 
        var newEmployeecode = getNewEmployee();
        $('#EmployeeCode').val(newEmployeecode);
        $('.dialog').show();
    });

    //Lưu dữ liệu
    $('.save').click(function () {
        btnSaveOnClick();
    });


    //click để chọn xóa dữ liệu
    $('#tableEmployee').on('click', 'tbody tr', function () {
        var employeeId = $(this).data('id_xoa');
        $('tbody tr').removeClass('selected');
        $(this).toggleClass('selected');
        employeeIdSelect = employeeId;
    });

    //double click -> hiện ra dialog
    $('#tableEmployee').on('dblclick', 'tbody tr', function () {
        var employeeId = $(this).data('id_xoa');
        showDialog(employeeId);
    });

    $(document).on('click', '#delete', function () {
        
        // Hiển thị cảnh báo cho người dùng:
        var result = confirm("Bạn có chắc chắn muốn xóa ?");
        if (result) {
            $.ajax({
                method: "DELETE",
                url: "http://api.manhnv.net/v1/Employees/" + employeeIdSelect,
            }).done(function () {
                alert("Xóa thành công!");
                loadData();
            }).fail(function (res) {
                alert("Không thể xóa, xin kiểm tra lại!");
            })
        }
    

    })
}



function showDialog(employeeId) {
    stt = 2;
    employeeIdSelect = employeeId;
    // Lấy dữ liệu từ bản ghi
    $.ajax({
        method: "get",
        url: "http://cukcuk.manhnv.net/api/v1/Employees" + employeeId,
    }).done(function (response) {
        $('#EmployeeCode').val(response.EmployeeCode);
        $("#FullName").val(response.FullName);
        $('#DateOfBirth').val(response.DateOfBirth);
        $('#GenderName').val(response.GenderName);
        $('#IdentityNumber').val(response.IdentityNumber);
        $('#IdentityDate').val(response.IdentityDate);
        $('#IdentityPlace').val(response.IdentityPlace);
        $('#Email').val(response.Email);
        $('#PhoneNumber').val(response.PhoneNumber);
        $('#PositionName').val(response.PositionName);
        $('#DepartmentName').val(response.DepartmentName);
        $('#PersonalTaxCode').val(response.PersonalTaxCode);
        $('#Salary').val(response.Salary);
        $('#CreatedDate').val(response.CreatedDate);
        $('#WorkStatus').val(response.WorkStatus);
    }).fail(function (response) {
        alert(response.responseText);
    });
    $('.dialog').show();
}

function checkCode(employeeCode) {
    var data = getData();
    var a = 0;
    $.each(data, function (index, value) {
        if (value.EmployeeCode == employeeCode && stt == 1) {

            a = 1;
        }
    });
    return a;
}

function btnSaveOnClick() {
    //Lấy dữ liệu từ input select 
    $('input').focus(function () {
        $('#EmployeeCode').val("A");
    });
    var EmployeeCode = $('#EmployeeCode').val();
    var FullName = $('#FullName').val();
    var Gender = $('#Gender').val();
    var DateOfBirth = $('#DateOfBirth').val();
    var IdentityNumber = $('#IdentityNumber').val();
    var IdentityDate = $('#IdentityDate').val();
    var IdentityPlace = $('#IdentityPlace').val();
    var Email = $('#Email').val();
    var PhoneNumber = $('#PhoneNumber').val();
    var PositionId = $('#PositionId').val();
    var DepartmentId = $('#DepartmentId').val();
    var PersonalTaxCode = $('#PersonalTaxCode').val();
    var Salary = $('#Salary').val();
    var CreatedDate = $('#CreatedDate').val();
    var WorkStatus = $('#WorkStatus').val();
    // Build thành object:
    var employee = {
        "EmployeeCode": EmployeeCode,
        "FullName": FullName,
        "Gender": Gender,
        "DateOfBirth": DateOfBirth,
        "IdentityNumber": IdentityNumber,
        "IdentityDate": IdentityDate,
        "IdentityPlace": IdentityPlace,
        "Email": Email,
        "PhoneNumber": PhoneNumber,
        "PositionId": PositionId,
        "DepartmentId": DepartmentId,
        "PersonalTaxCode": PersonalTaxCode,
        "Salary": Salary,
        "CreatedDate": CreatedDate,
        "WorkStatus": WorkStatus,
    }

    //Kiểm tra xem mã nhân viên có bị trùng không

    //Kiểm tra xem email xem có hợp lệ hay không nếu ko hợp lệ thì trả về 1
    var checkemail = checkEmail(employee.Email);
    var checkcode = checkCode(employee.EmployeeCode);
   


    //Nếu như tất cả ok thì gửi dữ liệu nên serve
    if (checkcode == 1) {
        alert("nhập lại mã nhân viên");
    } else if (checkemail == 2) {
        alert("Nhập lại mail");
    } else {
        var method = "POST";
        var url = "http://cukcuk.manhnv.net/api/v1/Employees";
        if (stt == 2) {
            method = "PUT";
            url = "http://cukcuk.manhnv.net/api/v1/Employees/" + employeeIdSelect;
        }
        // debugger;
        // Gọi service POST để thực hiện cất dữ liệu:
        $.ajax({
            method: method,
            url: url,
            data: JSON.stringify(employee),
            contentType: 'application/json'
        }).done(function (res) {
            if (status == 2) {
                alert("Sửa thành công");
            } else alert("Thêm mới thành công");

            $('.dialog').hide();
            // load lại dữ liệu
            loadData();
        }).fail(function (res) {
            console.log(res);
            alert(res.responseText);
        })
    }
}

function loadData() {
    var data = getData();
    showdataTable(data);
    $('.department').change(function () {
        var filterdepartment = filterDepartment();
        showdataTable(filterdepartment);
    });

    $('.position').change(function () {
        var filterdepartment = filterDepartment();
        showdataTable(filterdepartment);
    });

}

//hàm check mail
function checkEmail(email) {
    var regExp = /^[A-Za-z][\w$.]+@[\w]+\.\w+$/;
    if (regExp.test(email))
        return 0;
    else
        return 2;
}

function getNewEmployee() {
    var employees = "";
    $.ajax({
        method: "get",
        url: "http://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
        data: null,
        async: null,
        contentType: "application/json",
    }).done(function (response) {
        employees = response;
    }).fail(function () {
        alert("Không thể lấy dữ liệu từ API")
    });
    return employees;
}

//Hàm show dữ liệu trên bảng table
function showdataTable(data) {
    var html = ""
    $.each(data, function (index, value) {
        var date = formatDate(value.DateOfBirth);
        var money = formatMoney(value.Salary);
        html +=
            `<tr data-id_xoa=${value.EmployeeId}>
                <td>${value.EmployeeCode}</td>
                <td>${value.FullName}</td>
                <td>${value.GenderName}</td>
                <td>${date}</td>
                <td>${value.PhoneNumber}</td>
                <td>${value.Email}</td>
                <td>${value.PositionName}</td>
                <td>${value.DepartmentName}</td>
                <td>${money} </td>
                <td>${value.WorkStatus}</td>
            </tr>`;
    });


    $('.table-employee table tbody').html('').append(html);
}

//Hàm format ngày tháng
function formatDate(date) {
    if (!date) return "";
    var newDate = new Date(date);
    var day = newDate.getDate();
    var month = newDate.getMonth();
    var year = newDate.getFullYear();

    day = (day < 10 ? `0${day}` : day);
    month = (month < 10 ? `0${month}` : month);
    return `${day}/${month}/${year}`;
}

function getData() {
    var employees = "";
    $.ajax({
        method: "get",
        url: "http://cukcuk.manhnv.net/api/v1/Employees",
        data: null,
        async: null,
        contentType: "application/json",
    }).done(function (response) {
        employees = response;
    }).fail(function () {
        alert("Không thể lấy dữ liệu từ API")
    });
    return employees;
}

function formatMoney(money) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0
    })
    if (money) {
        return formatter.format(money) // "$1,000.00"
    }
    return "";
}


/*function phanTrang(pageN, pageS) {
    var employees
    $.ajax({
        method: "GET",
        url: "http://api.manhnv.net/v1/Employees/Filter" + "?pageSize=" + pageS + "&pageNumber=" + pageN,
        data: null,
        async: false,
        contentType: "application/json"
    }).done(function (response) {
        employees = response;
        alert("lấy thành công")
    }).fail(function (response) {
        alert("Không thể lấy dữ liệu từ Api");
        console.log(response.reponseText);
        alert(response.reponseText);
    });
    return employees
}*/

//Lọc dữ liệu
function filterDepartment() {
    var filterdepartment = "";
    var a = $('.department').val();
    $.ajax({
        method: 'get',
        url: "http://cukcuk.manhnv.net/api/v1/Departments/" + a,
        data: null,
        async: null,
        contentType: 'application/json',
    }).done(function (response) {
        filterdepartment = response;
        alert("Thành công");
    }).fail(function (response) {
        alert(response.responseText);
    });
    return filterdepartment;
}

function filterPosition() {
    var filterposition = "";
    var a = $('.position').val();
    $.ajax({
        method: 'get',
        url: "http://cukcuk.manhnv.net/api/v1/Positions/" + a,
        data: null,
        async: null,
        contentType: 'application/json',
    }).done(function (response) {
        filterposition = response;
        alert("Thành công");
    }).fail(function (response) {
        alert(response.responseText);
    });
    return filterposition;
}