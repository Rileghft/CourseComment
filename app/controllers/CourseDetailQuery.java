package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import mongo.MongoClientFactory;
import mongo.MongoQueryBuilder;
import org.bson.Document;
import org.jongo.MongoCollection;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Created by 楊舜宇 on 2017/1/9.
 */
public class CourseDetailQuery extends Controller{
    private static String courseField = "{_id: 0}";

    @BodyParser.Of(BodyParser.Json.class)
    public Result getCourseDetail() {
        JsonNode queryParam = request().body().asJson();
        Document doc = null;
        try {
            Integer year = queryParam.get("year").asInt();
            Integer sem = queryParam.get("sem").asInt();
            String courseID = queryParam.get("courseID").asText();
            String classID = queryParam.get("class").asText();
            MongoCollection courseDB = MongoClientFactory.getCollection(String.format("s%d%d.course", year, sem));
            MongoQueryBuilder queryBuilder = MongoQueryBuilder.create()
                    .setQueryField("courseID", courseID, "")
                    .setQueryField("classID", classID, "");
            doc = courseDB.findOne(queryBuilder.buildQuery()).projection(courseField).as(Document.class);
        }catch (Exception e) {
            e.printStackTrace();
        }
        return ok(doc.toJson()).as("application/json");
    }
}
