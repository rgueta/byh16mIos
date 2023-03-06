export const Utils = {
    convDate: function(today:any){
        var day = ("0" + today.getDate()).slice(-2);
        var month = ("0" + (today.getMonth() + 1 )).slice(-2);
        var year = today.getFullYear();
        var hour = ("0" + today.getHours()).slice(-2);
        var minutes = ("0" + today.getMinutes()).slice(-2);
        var seconds = ("0" + today.getSeconds()).slice(-2);
        var milis = ("0" + today.getMilliseconds()).slice(-3);

        return year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":" + seconds + "." + milis;
    },

    convDateToday: function(){
        var today = new Date();
        var day = ("0" + today.getDate()).slice(-2);
        var month = ("0" + (today.getMonth() + 1 )).slice(-2);
        var year = today.getFullYear();
        var hour = ("0" + today.getHours()).slice(-2);
        var minutes = ("0" + today.getMinutes()).slice(-2);
        var seconds = ("0" + today.getSeconds()).slice(-2);
        var milis = ("0" + today.getMilliseconds()).slice(-3);

        return year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":" + seconds + "." + milis;
    },

    sortJSON: function(arr:any, key:any, asc=true){
        return arr.sort((a:any, b:any) => {
          let x = a['name'][key];
          let y = b['name'][key];
          if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
          else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
        });
      }

}
