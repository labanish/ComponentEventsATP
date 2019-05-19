require ('custom-env').env('stagging')
const apiURL = '/mobile/atp/components';

// Reference component shell
var shell = require('./shell')();

const express = require('express')
const bodyParser = require('body-parser')
const service = express()

const request = require('request')

service.set('port', (process.env.PORT || 5004))

// Process application/x-www-form-urlencoded
service.use(bodyParser.urlencoded({extended: false}))

// Process application/json
service.use(bodyParser.json())

/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service
 */
//module.exports = function(service) {

  /**
   * Retrieves metadata for components implemented by this service.
   */
  service.get(apiURL, function(req,res) {
    res.set('Content-Type', 'application/json')
       .status(200)
       .json(shell.getAllComponentMetadata());
  });

  /**
   * Invoke the named component
   */
  service.post(apiURL+'/:componentName', function(req,res) {
console.log("HELLO");
    const sdkMixin = { oracleMobile: req.oracleMobile  };
    console.log(req.params.componentName);
    shell.invokeComponentByName(req.params.componentName, req.body, sdkMixin, function(err, data) {
        if (!err) {
            res.status(200).json(data);
        }
        else {
            switch (err.name) {
                case 'unknownComponent':
                    res.status(404).send(err.message);
                    break;
                case 'badRequest':
                    res.status(400).json(err.message);
                    break;
                default:
                    res.status(500).json(err.message);
                    break;
            }
        }
    });
  });
//};
//

// Spin up the server
 service.listen(service.get('port'), function() {
     console.log('running on port', service.get('port'))
     })
