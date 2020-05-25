USE rogue;

CREATE TABLE users(
    id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE items(
    short_name VARCHAR(30) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    link VARCHAR(100) NOT NULL,
    link_type VARCHAR(10) NOT NULL,
    PRIMARY KEY(short_name)
);

CREATE TABLE searches(
    user_id BIGINT NOT NULL,
    item_name VARCHAR(30) NOT NULL,
    item_full_name VARCHAR(100) NOT NULL,
    start_time DATETIME default CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id, item_name)
);