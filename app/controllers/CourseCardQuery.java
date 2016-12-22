package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.jongo.MongoCollection;
import org.jongo.MongoCursor;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import mongo.MongoClientFactory;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by 楊舜宇 on 2016/12/18.
 */
public class CourseCardQuery extends Controller{

    public Result defaultCards() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH);
        int roc_year = year - 1911;
        int semester = (month > 11 || month < 5)? 2: 1;
        int semester_year = roc_year - (semester == 2? 1: 0);
        MongoCollection cardDB = MongoClientFactory.getCollection(String.format("s%d%d.courseCard", semester_year, semester));
        String deptType = request().getQueryString("deptType");
        if (null == deptType) {
            deptType = "all";
        }
        String queryString;
        if ("".equals(injectionCheck(deptType)) || "all".equals(deptType)) {
            queryString = "{}";
        }
        else {
            queryString = String.format("{'courseID': {$regex: '%s'}}", deptType);
        }
        System.out.println(deptType);
        System.out.println(queryString);
        MongoCursor<Document> cards = cardDB.find(queryString).sort("{'recommend': -1}").limit(20).as(Document.class);
        ArrayList<String> results = new ArrayList<>(cards.count());
        cards.forEach(card -> {
            card.remove("_id");
            results.add(card.toJson());
        });
        return ok(results.toString()).as("application/json");
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result moreCards() {
        JsonNode option = request().body().asJson();
        return badRequest("not implement.");
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result filterCourse() {
        JsonNode queryParam = request().body().asJson();
        List<String> results = new LinkedList<>();
        try {
            Integer year = queryParam.get("year").asInt();
            Integer semester = queryParam.get("sem").asInt();
            String deptType = queryParam.get("deptType").asText();
            Integer grade = queryParam.get("grade").asInt(1);
            String degree = queryParam.get("degree").asText();
            List<Integer> times = queryParam.findValues("times").stream()
                    .map(JsonNode::asInt).collect(Collectors.toList());
            queryParam.withArray("times").forEach(time -> times.add(time.asInt()));
            String type = queryParam.get("type").asText("必修");

            MongoCollection courseDB = MongoClientFactory.getCollection(String.format("s%d%d.course", year, semester));
            StringBuilder queryBuilder = new StringBuilder();
            queryBuilder.append(String.format("{deptType: '%s'", injectionCheck(deptType)))
                    .append(String.format(", grade: %d", grade))
                    .append(String.format(", degree: '%s'", degree))
                    .append(String.format(", type: '%s'", injectionCheck(type)));
            if (times.isEmpty()) {
                queryBuilder.append("}");
            }
            else {
                queryBuilder.append(String.format(", place_time: %s}", times));
            }
            queryBuilder.append(", {card_ref: 1}");
            MongoCursor<Document> cardRefs = courseDB.find(queryBuilder.toString()).as(Document.class);
            MongoCollection cardDB = MongoClientFactory.getCollection(String.format("s%d%d.courseCard", year, semester));
            List<ObjectId> objIDs = new ArrayList<>(cardRefs.count());
            cardRefs.forEach(ref -> objIDs.add(ref.getObjectId("card_ref")));
            MongoCursor<Document> cards = cardDB.find("{ _id: { $in: #}}", objIDs).as(Document.class);
            cards.forEach(card -> {
                card.remove("_id");
                results.add(card.toJson());
            });
        } catch (Exception e) {
            e.printStackTrace();
            return badRequest("Illegal Argument");
        }
        return ok(results.toString()).as("application/json");

    }

    private static String injectionCheck(String param) {
        if (param.matches("[\\u4E00-\\u9fa5\\w\\d]+")){
            return param;
        }
        else {
            return "";
        }
    }
}
