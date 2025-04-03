import {app, server} from "./lib/app";

server.listen(process.env.PORT || 5001, () => {
  console.log("Server started at http://localhost:", process.env.PORT || 5001);

});