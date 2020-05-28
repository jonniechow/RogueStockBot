SELECT * FROM `rogue`.`searches`;

SELECT * FROM `rogue`.`restock`;

SELECT * FROM `rogue`.`items`;

DELETE FROM `rogue`.`searches` ;

SELECT C.num_searches, S.* FROM searches S, 
(SELECT COUNT(*) num_searches from searches
group by user_id) C
WHERE item_name='plate cal';

SELECT C.num_searches, C.user_id FROM searches S,
              (SELECT COUNT(*) num_searches, user_id
              FROM searches
              GROUP BY user_id) C
              WHERE item_name='plate machined';

SELECT COUNT(*) num_searches, user_id
              FROM searches
              GROUP BY user_id;

(SELECT * FROM searches WHERE item_name='plate machined') S1
JOIN
(SELECT COUNT(*) num_searches, user_id
              FROM searches
              GROUP BY user_id) S2
ON S1.user_id = S2.user_id;