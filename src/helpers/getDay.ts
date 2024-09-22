export default function getDay() {
    // Choose actor based on days since 9/21/2024
    const date = new Date();
    const start = new Date(2024, 8, 20);
    const day = Math.floor((date.getTime() - start.getTime()) / (1000 * 3600 * 24));

    return day;
}