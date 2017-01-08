
var SearchEngine = module.exports = {}

SearchEngine.createIndex = function (index, type, data){
	let bulkBody = [];
  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      } 
    })
    bulkBody.push(item);
  });
  return global.client.bulk({ body:  bulkBody})
  .then(response => {
    console.log("here in response of bulk");
    let error = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error){
        console.log(++error, item.index.error);
      }
    });
    console.log(`Successfully indexed ${data.length - error} out of ${data.length} items`)
    return response;
  })
  .catch(err => {
    console.log(err);
  })
}

SearchEngine.search = (query) => {
	return global.client.search({ index: 'restaurants', body: query })
  .then((resp) => {
    console.log(`found ${resp.hits.total} items in ${resp.took}ms`);
    return { 'results': resp.hits.hits, 'time': resp.took, 'total': resp.hits.total};
  })
  .catch(console.error)
}

SearchEngine.indices = function(){
  return global.client.cat.indices({v: true})
  .then(console.log)
  .catch(err => console.error(`Error connecting to es global.client ${err}`))
}

/**
 * @param  {[indexName]}
 * @return {[{acknowledge: true}]}
 */
SearchEngine.deleteIndex = (index) => {
	return global.client.delete({
		index: index
	});
}

 /**
  * [description]
  * @param  {[string]} search string
  * @param  {[string]} index name
  * @return {[json]}  suggestion json
  */
SearchEngine.suggest = (param, index) => {
  return global.client.suggest({
    index: index,
    body: {
      mysuggester: {
        text: param,
        term: {
          field: 'name'
        }
      }
    }
  })
}