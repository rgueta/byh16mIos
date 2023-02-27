export const environment = {
  production: true,
  app : {
    version: "3.0.0",
    Description: "Main tab data information feed",
    debugging: true
  },
  db : {
    neighbor_role : "60c642849f93ea09e4bbe3c6",
    // status 1 = Active; 2 = Inactive, 3 = New register
    register_status : 3,
    // "server_url" : "http://ec2-52-55-153-194.compute-1.amazonaws.com/"
    server_url : "http://192.168.1.109:5000/"
  }
};
