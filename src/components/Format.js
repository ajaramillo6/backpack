export const numberFormat = (num) => {
    if(Math.abs(num) > 999 && Math.abs(num) < 1000000){
      return Math.sign(num) * ((Math.abs(num)/1000).toFixed(1)) + 'K';
    } else if(Math.abs(num) > 99999 && Math.abs(num) < 1000000000){
      return Math.sign(num) * ((Math.abs(num)/1000000).toFixed(1)) + 'M';
    } else if(Math.abs(num) > 999999 && Math.abs(num) < 1000000000000){
      return Math.sign(num) * ((Math.abs(num)/1000000000).toFixed(1)) + 'B';
    } else {
      return Math.sign(num)*Math.abs(num);
    }
}

export const timeSince = (date) => {

    let seconds = Math.floor((date) / 1000);
    let interval = seconds / 31536000;
    
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 604800;
    if (interval > 1) {
      return Math.floor(interval) + " weeks ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }