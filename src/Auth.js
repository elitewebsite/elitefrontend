export default function cheackAuth() {
    let flag = false;
    localStorage.getItem('token') ? flag = true : flag = false;
    return flag
}