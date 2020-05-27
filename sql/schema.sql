USE rogue;

CREATE TABLE items(
    short_name VARCHAR(30) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    link VARCHAR(100) NOT NULL,
    link_type VARCHAR(10) NOT NULL,
    stock_count INT NOT NULL,
    PRIMARY KEY(short_name)
);

CREATE TABLE searches(
    user_id BIGINT NOT NULL,
    item_name VARCHAR(30) NOT NULL,
    item_full_name VARCHAR(100) NOT NULL,
    start_time DATETIME default CURRENT_TIMESTAMP NOT NULL,
    count INT NOT NULL,
    PRIMARY KEY(user_id, item_name)
);

CREATE TABLE restock(
    restock_id INT NOT NULL AUTO_INCREMENT,
    restock_time VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    restock_string VARCHAR(500) NOT NULL,
    link VARCHAR(100) NOT NULL,
    PRIMARY KEY(restock_id)
);