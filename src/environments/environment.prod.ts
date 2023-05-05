export const environment = {
  production: true,
  app : {
    version: "3.0.0",
    Description: "Main tab data information feed",
    debugging: true,
    debugging_send_sms: false
  },
  db : {
    // status 1 = Active; 2 = Inactive, 3 = New register
    register_status : 3,
    // "server_url" : "http://ec2-52-55-153-194.compute-1.amazonaws.com/"
    // "server_url" : "http://34.229.28.145/"
    server_url : "http://192.168.1.154:5000/",
  }
};
