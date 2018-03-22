var Q = require('q');
//var $ = require('jQuery');

module.exports = {

    /**
     * @params 
     * model: mongoose model
     * req: req object
     * req.query={
     *  q:json string,
     *  filters:json string,
     *  sortBy: string(column name),
     *  sortDirection: 1/-1,
     *  pagesize: number(per page),
     *  page: number(which page)
     * }
     */
    'getList': function(model,req,res,next){
        var q = {};
        var filters = {};
        var pageSize = 10;
        var page = 1;
        var sort = {
            columnName : 'id',
            direction : 'asc'
        };
        req.query.q && (q = JSON.parse(req.query.q));
        req.query.filters && (filters = JSON.parse(req.query.filters));
        req.query.page && (page = parseInt(req.query.page));
        req.query.pageSize && (pageSize = parseInt(req.query.pageSize));
        if(req.query.sort){
            sort = JSON.parse(req.query.sort);
        }else{
            if(req.query.sortBy){
                sort.columnName = req.query.sortBy;
            }
            if(req.query.sortDirection){
                sort.direction = req.query.sortDirection;
            }
        }
       
        var sortObj ={};
        sortObj[sort.columnName] = (sort.direction == 'asc') ? 1 : -1;


        var listQuery = model.find(q).sort(sortObj).skip((page-1)*pageSize).limit(pageSize);
        var countQuery =  model.find(q).count();
        var promises = [
            listQuery.exec(),
            countQuery.exec(),
        ];
        for(var i in filters){
            var filterType = filters[i].t;
            var filterBy = i;
            var qWithOutCurBy = JSON.parse( JSON.stringify( q ) );
            if(qWithOutCurBy[filterBy]){
            delete qWithOutCurBy[filterBy];
            }
            var filterquery = null;
            if(filterType == 'number-range'){
                filterquery = model.find(qWithOutCurBy).sort(filterBy);
            }else{
                //filterquery = model.find(qWithOutCurBy);
                var aggrQ = [{
                        $match: qWithOutCurBy
                    },{
                        $group:{
                            _id: "$"+filterBy,
                            count:{ 
                                $sum : 1
                            }
                        }
                    }
                ];
                filterquery = model.aggregate(aggrQ);
            }
            promises.push(filterquery.exec());
        }
        Q.all(promises).then(function(data){
            return res.json(module.exports.mapResponseFromQueryResult(data,filters,q,sort,page,pageSize));      
        }).catch(function(err){
            return res.status(500).send(err);
        });
    },
    'mapResponseFromQueryResult' : function(result, filters, q, sort, page,pageSize){
        var index = 0;
        var responseData = {};
        //results
        responseData.results = result[index++];
        //totalCount
        responseData.totalCount = result[index++];
        //currentPage
        responseData.page = page;
        //currentSort
        responseData.sort = sort;
        //pages
        var pages = parseInt( responseData.totalCount / pageSize);
        ( responseData.totalCount % pageSize) != 0 && (pages ++);
        responseData.pages = pages;
        //filterOptions
        var filterData = {};
        for(var i in filters){
            var data = result[index++];
            var filterType = filters[i].t;
            var filterBy = i;
            if(filterType == 'number-range'){
                
                let min = data[0][filterBy];
                let max = data[data.length - 1][filterBy];
                let minArray = [];
                let maxArray = [];
                let diff = 1;
                if(filters[i].d){
                diff = filters[i].d;
                }
                minArray.push(min);
                let minByDif = diff;
                while( minByDif < max ){
                if( minByDif > min ){
                    minArray.push(minByDif);
                    maxArray.push(minByDif);
                }
                minByDif = minByDif + diff;
                }
                maxArray.push(max);
                filterData[filterBy]={
                    min : minArray,
                    max : maxArray
                };
                if(q[filterBy] && q[filterBy]['$gte']){
                    filterData[filterBy].minSelected = q[filterBy]['$gte'];
                }
                if(q[filterBy] && q[filterBy]['$lte']){
                    filterData[filterBy].maxSelected = q[filterBy]['$lte'];
                }
            }else{
                filterData[filterBy]= data.map(function(current,i,arr){
                    current.value = current._id;
                    if(q[filterBy] && q[filterBy]['$in'].indexOf(current.value) != -1){
                        current['checked'] =  true;
                    }else{
                        current['checked'] =  false;
                    }
                    return current;
                });
            }
        }
        responseData.filterOptions = filterData;

        return responseData;
    },
    'get':function(model,req,res,next){
        var props = Object.keys(model.schema.paths);
        console.log(props);
        model.find({}, function(err, data) {
            if(err){
                return res.status(500).send(err);
            }
            res.json(data);  
        });
    },
    'post':function(model,req,res,next){
        var props = Object.keys(model.schema.paths);
        var modelObj = new model();
        for(var i in props){
            var key = props[i];
            if(req.body[key]){
                modelObj[key] = req.body[key];
            }
        }
        console.log(modelObj);
        modelObj.save(function(err,data){
            if(err){
            return res.send(500,err);
            }
            return res.json(data);
        });
        
    }
};