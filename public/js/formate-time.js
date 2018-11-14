function formate(time) {
    if(time) {
        let year = new Date(time*1000).getFullYear();
        let month = new Date(time*1000).getMonth() + 1;
        let date = new Date(time*1000).getDate();
        return year + '-' + month + '-' + date
    }
}