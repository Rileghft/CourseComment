package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Sets;
import org.bson.Document;
import org.jongo.MongoCollection;
import org.jongo.MongoCursor;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import mongo.MongoClientFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by 楊舜宇 on 2016/12/18.
 */
public class CourseCardQuery extends Controller{
    private static String cardFields = "{courseID: 1, name: 1, classID: 1, credit:1, type: 1, teachers: 1, times: 1," +
        " recommend: 1, difficulty: 1, attrs: 1, tags: 1, _id: 0}";
    private static Set<String> acceptDegrees = Sets.newHashSet("學士", "碩士", "博士");

    public Result defaultCards() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH);
        int roc_year = year - 1911;
        int semester = (month > 11 || month < 5)? 2: 1;
        int semester_year = roc_year - (semester == 2? 1: 0);
        MongoCollection cardDB = MongoClientFactory.getCollection(String.format("s%d%d.course", semester_year, semester));
        String deptType = request().getQueryString("deptType");
        String degree = request().getQueryString("degree");
        StringBuilder queryBuilder = new StringBuilder();
        if(!acceptDegrees.contains(degree) || degree.length() != 2) {
            degree = "學士";
        }
        if (null == deptType || "all".equals(deptType) || deptType.length() != 2) {
            queryBuilder.append("{}");
        }
        else {
            queryBuilder.append(String.format("{deptType: '%s', degree: '%s'}}", injectionCheck(deptType), injectionCheck(degree)));
        }
        MongoCursor<Document> cards = cardDB.find(queryBuilder.toString()).projection(cardFields)
                .sort("{'recommend': -1}").limit(20).as(Document.class);
        ArrayList<String> results = new ArrayList<>(cards.count());
        cards.forEach(card -> results.add(card.toJson()));
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
                    .append(String.format(", type: '%s'", injectionCheck(type)))
                    .append((times.isEmpty())? "}": String.format(", place_time: %s}", times));
            MongoCursor<Document> cards = courseDB.find(queryBuilder.toString())
                    .projection(cardFields).as(Document.class);
            cards.forEach(card -> results.add(card.toJson()));
        } catch (Exception e) {
            e.printStackTrace();
            return badRequest("Illegal Argument");
        }
        return ok(results.toString()).as("application/json");

    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result search() {
        JsonNode queryParam = request().body().asJson();
        List<String> results = new LinkedList<>();
        try {
            Integer year = queryParam.get("year").asInt();
            Integer semester = queryParam.get("sem").asInt();
            String searchText = queryParam.get("searchText").asText();
            searchText = (searchText == null) ? "" : injectionCheck(searchText);
            searchText = searchText.replace("", ".*?");
            System.out.println(searchText);
            MongoCollection courseDB = MongoClientFactory.getCollection(String.format("s%d%d.course", year, semester));
            StringBuilder queryBuilder = new StringBuilder();
            queryBuilder.append(String.format("{$or: [{teachers: {$regex: '%s'}}, {name: {$regex: '%s'}}]}", searchText, searchText));
            MongoCursor<Document> cards = courseDB.find(queryBuilder.toString())
                    .projection(cardFields).as(Document.class);
            cards.forEach(card -> results.add(card.toJson()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ok(results.toString()).as("application/json");
    }

    private static String injectionCheck(String param) {
        if (param != null && param.matches("[\\u4E00-\\u9fa5\\w\\d]+")){
            return param;
        }
        else {
            return "";
        }
    }
}
