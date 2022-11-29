import * as fs from 'fs'; 
import * as path from 'path'

/** Simple utility to get and set fields in a JSON file. 
 * Useful to be like a database for the rover and the map state.
 */

export class DatabaseController {
    /* the database have only one JSON file (JSON format is for
    easily change the content with JavaScript.) As there is only one file the file path is write below */
    static databaseFilePath = path.normalize(__dirname+'/..'+'/database/' + process.env.DATABASE_FILE_NAME);

    static writeFile(newContent) {
      try {
        fs.writeFileSync(this.databaseFilePath, newContent);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }

    static getDbParsed() {
      console.log(this.databaseFilePath);
      let data = fs.readFileSync(this.databaseFilePath, 'utf8'); // read data
      return JSON.parse(data); // convert JSON to Object
    }

    static set(keyValueObj: {}) {   
      try {
        let data = this.getDbParsed();

        for (const prop in keyValueObj) {
            data['database'][prop] = keyValueObj[prop];
        }

        data = JSON.stringify(data); // serialization (obj > string)
        const res = this.writeFile(data); // write new data to json file

        if(res) {
          return data;
        } else {
          return false;
        }
        

      } catch (err) {
          console.error(err);
          return false;
      }
    }

    static get(keyNames: string[]) { 
      try {
        let data = this.getDbParsed();

        let objValues = {};
        keyNames.forEach((el, index) => { // loop on keys and search in database data
          if(data['database'][el]) // set property only if the key exist on the database
            objValues[el] = data['database'][el]; // set the key
        });

        return objValues;
      } catch (err) {
          console.error(err);
          return false;
      }
    }

    static getAll() {
      try {
        const data = DatabaseController.getDbParsed();
        return data['database'];
      } catch (err) {
          console.error(err);
          return false;
      }
    }
}

/** example
 * 
 *     // todo: simplify like ...get('all') or ...get.all();
  const r1 = DatabaseController.get(['mapLength','mapGridObstacles', 'roverDirection']);

  const r2 = DatabaseController.set({
    'roverDirection':'W',
    'mapLength': 10
  });
 */

