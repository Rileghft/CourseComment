package mongo;

import javax.validation.constraints.NotNull;
import java.util.*;

/**
 * Created by 楊舜宇 on 2016/12/28.
 */
public class MongoQueryBuilder {
    private StringBuilder queryBuilder;
    private Map<String, Object> params;
    private Boolean isBuild;

    public static MongoQueryBuilder create() {
        MongoQueryBuilder builder = new MongoQueryBuilder();
        builder.queryBuilder = new StringBuilder();
        builder.params = new HashMap<>();
        builder.isBuild = false;
        return builder;
    }

    public void removeQueryField(@NotNull String field) {
        try {
            params.remove(field);
        } catch (Exception e) {}
    }

    public MongoQueryBuilder setQueryField(@NotNull String field, @NotNull String value, @NotNull String defaultValue) {
        if (!"".equals(injectionCheck(value))) {
            params.put(field, value);
        }
        else {
            params.put(field, defaultValue);
        }
        return this;
    }

    public MongoQueryBuilder setQueryField(@NotNull String field, @NotNull Integer intValue) {
        params.put(field, intValue);
        return this;
    }

    public MongoQueryBuilder setQueryField(@NotNull String field, @NotNull Double doubleValue) {
        params.put(field, doubleValue);
        return this;
    }

    public MongoQueryBuilder setQueryField(@NotNull String field, @NotNull Object []values) {
        List<Object> verifyValues = new ArrayList<>();
        if (values.length == 0) {
            return this;
        }
        for (int i = 0; i < values.length; ++i) {
            if (values[0] instanceof String && "".equals(injectionCheck(field))) {
                continue;
            }
            verifyValues.add(values[i]);
        }
        params.put(field, verifyValues);
        return this;
    }

    public String buildQuery() {
        if (!isBuild) {
            isBuild = true;
        }
        else {
            return queryBuilder.toString();
        }
        queryBuilder.append("{");
        Object []keys = params.keySet().toArray();
        for (int i = 0; i < params.size(); ++i) {
            Object value = params.get(keys[i]);
            if (value instanceof String) {
                queryBuilder.append(String.format("%s: '%s'", keys[i].toString(), value.toString()));
            }
            else if (value instanceof Integer) {
                queryBuilder.append(String.format("%s: %d", keys[i].toString(), (Integer) value));
            }
            else if (value instanceof Double) {
                queryBuilder.append(String.format("%s: '%f'", keys[i].toString(), (Double) value));
            }
            else if (value instanceof ArrayList<?>) {
                queryBuilder.append(String.format("%s: {$in: #}", keys[i].toString()));
            }
            else {
                continue;
            }
            if (i < params.size() - 1) {
                queryBuilder.append(", ");
            }
        }
        queryBuilder.append("}");
        return queryBuilder.toString();
    }

    private static String injectionCheck(String param) {
        if (param != null && param.matches("[\\u4E00-\\u9fa5\\w\\ \\d']+")) {
            return param;
        }
        else {
            return "";
        }
    }

}
