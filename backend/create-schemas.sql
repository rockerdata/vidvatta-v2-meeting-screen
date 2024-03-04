CREATE TABLE webinar_master (
    webinar_id SERIAL PRIMARY KEY,
    webinar_name VARCHAR(255),
    date_time TIMESTAMP,
    short_description_md TEXT,
    learning_outcomes_md TEXT,
    inserted_on TIMESTAMP,
    updated_on TIMESTAMP,
    image_path TEXT,
    recording_link TEXT
);

CREATE TABLE webinar_enrollment (
    webinar_id INT,
    user_id INT,
    inserted_on TIMESTAMP,
    updated_on TIMESTAMP,
    PRIMARY KEY (webinar_id, user_id),
    FOREIGN KEY (webinar_id) REFERENCES webinar_master(webinar_id)
);