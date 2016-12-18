package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import org.bson.Document;
import org.jongo.MongoCollection;
import org.jongo.MongoCursor;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import mongo.MongoClientFactory;

import java.util.ArrayList;
import java.util.Calendar;

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
        MongoCollection cardDB = MongoClientFactory.getCollection(String.format("s%d%d.courseCard", roc_year, semester));
        MongoCursor<Document> cards = cardDB.find("{}").limit(20).as(Document.class);
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
}
