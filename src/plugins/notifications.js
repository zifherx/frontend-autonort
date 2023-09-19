import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";
import "sweetalert2/dist/sweetalert2.all";

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

export function askDelete() {
    return Swal.fire({
        title: `¿Estás seguro que deseas eliminar?`,
        icon: "question",
        text: `No podrás revertir la operación`,
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
        background: "#fff",
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

export function alertError(title, message) {
    return Swal.fire({
        icon: "error",
        title: title,
        text: message,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        timer: timerCounter,
        didOpen: (a) => {
            a.addEventListener("mouseenter", Swal.stopTimer);
            a.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
}
