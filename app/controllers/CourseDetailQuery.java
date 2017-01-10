package controllers;

import mongo.MongoClientFactory;
import mongo.MongoQueryBuilder;
import org.bson.Document;
import org.jongo.MongoCollection;
import play.mvc.Controller;

/**
 * Created by 楊舜宇 on 2017/1/9.
 */
public class CourseDetailQuery extends Controller{

    public static Document getCourseDetail(Integer year, Integer sem, String courseID) {
        MongoCollection courseDB = MongoClientFactory.getCollection(String.format("s%d%d.course", year, sem));
        MongoQueryBuilder queryBuilder = MongoQueryBuilder.create()
                .setQueryField("courseID", courseID, "");
        Document doc = courseDB.findOne(queryBuilder.buildQuery()).as(Document.class);
        return doc;
    }
}
