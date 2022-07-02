import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage/", async ( req: express.Request, res: express.Response) => {
    let {image_url} = req.query;

    //    1. validate the image_url query
    if (!image_url) {
      return res.status(422).send("Image is required");
    };

    // 2. call filterImageFromURL(image_url) to filter the image
    const response =  await filterImageFromURL(image_url);

    // 3. send the resulting file in the response
    res.status(200).sendFile(response);

    // 4. deletes any files on the server on finish of the response
    res.on("finish", async function () {
      deleteLocalFiles([response]).catch((err)=>
      res.status(422).send(err));
    });
  });
  
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  });
})();