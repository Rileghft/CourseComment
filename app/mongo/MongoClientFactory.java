package mongo;

import com.mongodb.MongoClient;
import org.jongo.Jongo;
import org.jongo.MongoCollection;

/**
 * Created by 楊舜宇 on 2016/12/18.
 */

public class MongoClientFactory {
    static String uri = "localhost";
    static Integer port = 27017;
    static String defaultDB = "yzuCourse";
    static MongoClient client = new MongoClient(uri, port);

    public static MongoClient getClient() {
        return client;
    }

    public static Jongo getDefaultDB() {
        return new Jongo(client.getDB(defaultDB));
    }

    public static MongoCollection getCollection(String collectionName) {
        return getDefaultDB().getCollection(collectionName);
    }

}
