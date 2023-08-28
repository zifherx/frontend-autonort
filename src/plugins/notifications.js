import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const timerCounter = 2500;

export function askQuestion(question, subtitle) {
    return Swal.fire({
        title: `¿${question}?`,
        icon: "question",
        text: `${subtitle}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonColor: "#388e3c",
        cancelButtonColor: "#d50000",
        cancelButtonText: "Cancelar",
        confirmButtonText: "¡Sí!",
    });
}

export function notify_Succesfull(message) {
    const toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: timerCounter,
        timerProgressBar: true,
        didOpen: (a) => {
            a.addEventListener("mouseenter", Swal.stopTimer), a.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    return toast.fire({
        icon: "success",
        title: message,
    });
}