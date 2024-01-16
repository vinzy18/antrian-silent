let socket;

const grantNotifPermission = () => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission()
        }
    } else {
        alert("This browser does not support notification")
    }
}
grantNotifPermission();

const notifyMe = (title, body) => {
    const notification = new Notification(title, {
        body,
        icon: 'public/assets/icon.ico',
        vibrate: navigator.vibrate(200)
    });
}

$(document).ready(() => {
    $("#joinQueue").on("submit", function (e) {
        console.log('submitted')
        e.preventDefault()

        setLoading(true)
        const formData = new FormData(this)
        const tanggal_kunjungan = formData.get('tanggal_kunjungan')
        const klinik = formData.get('klinik')
        const antrian = formData.get('antrian')
        const tanggal_lahir = formData.get('tanggal_lahir')
        authenticate(tanggal_kunjungan, klinik, antrian, tanggal_lahir)
    })
})

const setLoading = (state) => {
    if (state) {
        $("#join-button").prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading ...
        `)
    } else {
        $("button[type='submit']").prop('disabled', false).html(`
            MULAI MONITORING ANTRIAN
        `)
    }
}

const authenticate = async (tanggal_kunjungan, klinik, antrian, tanggal_lahir) => {
    socket = io(url, {
        query: {
            visitDate: tanggal_kunjungan,
            clinicId: klinik,
            patientId: antrian,
            birthDate: tanggal_lahir
        },
        closeOnBeforeunload: true,
    });

    socket.on('connect', () => {
        console.log('Socket Connected')
    })

    socket.on('init', (payload) => {
        console.log("payloads", payload)
        setLoading(false)
        $("#alert-connected").show()
        $('#joinQueueFieldset').prop('disabled', true); //Disable form

        // -> Fill retrieved data to Queue Section
        $("#clinicName").text(payload.clinic)
        $("#patientId").text(payload.patientId)
        $("#service").text(payload.service)
        $("#patientName").text(payload.patientName)
        $("#visitDate").text(new Intl.DateTimeFormat('id-ID').format(new Date(payload.visitDate * 1000)))
        $("#birthDate").text(new Intl.DateTimeFormat('id-ID').format(new Date(payload.birthDate * 1000)))

        // -> Move to Queue Section
        if ($("#auth-section").hasClass("active")) {
            $("#auth-section").removeClass("active")
        }
        $("#queue-section").addClass("active")

        showWaiting()
        updateExaminations(payload.rooms)
    })

    socket.on('call', (payload) => {
        console.log("Called")
        showCalling(payload.roomId, payload.roomName)
    })

    socket.on('finish', (payload) => {
        console.log("Finished")
        showWaiting()
        updateExaminations(payload.rooms)
    })

    socket.on('done', (payload) => {
        console.log("Done")
        showFinished()
        updateExaminations(payload.rooms)
    })

    socket.on('disconnect', () => {
        setLoading(false)
        $("#joinQueueFieldset").prop('disabled', false)
        if ($("#queue-section").hasClass("active")) {
            $("#queue-section").removeClass("active")
        }
        if ($("#examination-section").hasClass("active")) {
            $("#examination-section").removeClass("active")
        }
        $("#auth-section").addClass("active")
    })
}

function showWaiting() {
    if ($("#buletan").hasClass("bg-secondary")) {
        $("#buletan").removeClass("bg-secondary")
    }
    if ($("#buletan").hasClass("bg-warning")) {
        $("#buletan").removeClass("bg-warning")
    }
    $("#buletan").addClass("bg-grey")
    $("#buletan").html(`
        <span style="width: 60%; color: #fff;">
            <p style="font-size: 24px; font-weight: bold;">
                BELUM
                <br>
                ADA
                <br>
                PANGGILAN
            </p>
        </span>
    `)

}

function showCalling(roomNumber, roomName) {
    if ($("#buletan").hasClass("bg-warning")) {
        $("#buletan").removeClass("bg-warning")
    }
    if ($("#buletan").hasClass("bg-grey")) {
        $("#buletan").removeClass("bg-grey")
    }
    $("#buletan").addClass("bg-secondary")
    $("#buletan").html(`
        <span style="width: 60%; color: #fff;">
            <p style="font-size: 20px; font-weight: 500;">SILAKAN MENUJU RUANG</p>
            <p class="blink_me" style="font-size: 100px; font-weight: bold; line-height: 1;">
                ${roomNumber ?? "-"}
            </p>
            <p style="font-size: 24px; font-weight: bold;">${roomName ?? "-"}</p>
        </span>
    `)
    notifyMe('Panggilan antrian', `Silahkan ke ruang ${roomNumber} (${roomName}) sekarang`)
}

function showFinished() {
    if ($("#buletan").hasClass("bg-secondary")) {
        $("#buletan").removeClass("bg-secondary")
    }
    if ($("#buletan").hasClass("bg-grey")) {
        $("#buletan").removeClass("bg-grey")
    }
    $("#buletan").addClass("bg-warning")
    $("#buletan").html(`
        <span style="width: 100%; color: #fff;">
            <p style="font-size: 20px; font-weight: bold;">TINDAKAN SELESAI</p>
            <p style="font-size: 14px; font-weight: 500;">SILAHKAN HUBUNGI NURSE STATION UNTUK INFORMASI LEBIH LANJUT</p>
        </span>
    `)
}

function updateExaminations(rooms) {
    $("#examinationList").html('')
    for (const room of rooms) {
        $("#examinationList").append(`
            <div class="rooms">
                <span class="row text-dark fw-bold">
                    <span class="col-10">${room.name}</span>
                    <span class="col-2 badge rounded-pill ${room.status == 'Selesai' ? 'text-bg-success' : 'text-bg-secondary'} float-right">${room.status}</span>
                </span>
                ${room.examinations.map((el, i) => `<span class="row text-muted"><span class="col-12">&emsp; ${el}</span></span>`).join('')}
            </div>
        `)
    }
}