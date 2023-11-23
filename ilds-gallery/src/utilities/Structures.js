export const ICD = {
    TOKEN_HOST: "icdaccessmanagement.who.int",
    TOKEN_PATH: "/connect/token",
    TOKEN_URL: "https://icdaccessmanagement.who.int/connect/token",
    SCOPE: "icdapi_access",
    GRANT_TYPE: "client_credentials",
    QUERY_HOST: "id.who.int"
}

export const METHODS = {
    GET: "GET",
    POST: "POST"
}

export class Participant {
    participant_id;
    mob;
    sex;
    eye_colour;
    skin_type;
    ethnicity;
    hair_colour;
    tags;

    constructor(pid, mob, sex, eyecol, skintype, eth, hc) {
        this.participant_id = pid;
        this.mob = mob;
        this.sex = sex;
        this.eye_colour = eyecol;
        this.skin_type = skintype;
        this.ethnicity = eth;
        this.hair_colour = hc;
    }
}

export class Lesion {
    lesion_id;
    diagnosis_entity;
    morphology;
    anatomic_site;
    severity;
}

export class Measurement {
    measurement_id;
    lesion; // Lesion class
    measurement_date;
    is_lesion;
    modality;
    operator;
}

export class Case {
    caseID;
    ancestors;
    image;
    title;
    age;
    sex;
    history;
    ethnicity;
    userEntity;
    clinicianEntity;
    pathologistEntity;
    anatomicSite;
    size;
    severity;
    fitzpatrickType;
    ita;
    tags;
}

export class ImageMetadata {
    filename;
    modality;
    camera;
    imaging_conditions;
    anatomicSite;
    operator;
    image_quality;
    illumination;
    color_constancy_applied;
    view;
}

export const SERVER_ENDPOINT = `http://128.189.163.168:8081`;
// export const SERVER_ENDPOINT = `http://localhost:9000`;

export const ANATOMIC_SITES = [
    {
        site:"Head",
        index:2
    },
    {
        site:"Neck",
        index:158
    },
    {
        site:"Upper trunk",
        index:169
    },
    {
        site:"Lower trunk",
        index:199
    },
    {
        site:"Genital region",
        index:218
    },
    {
        site:"Perigenital region",
        index:246
    },
    {
        site:"Perianal region",
        index:250
    },
    {
        site:"Shoulder",
        index:256
    },
    {
        site:"Axilla",
        index:260
    },
    {
        site:"Upper arm",
        index:264
    },
    {
        site:"Elbow",
        index:269
    },
    {
        site:"Forearm",
        index:274
    },
    {
        site:"Wrist",
        index:279
    },
    {
        site:"Hand",
        index:284
    },
    {
        site:"Buttock",
        index:383
    },
    {
        site:"Thigh",
        index:385
    },
    {
        site:"Knee",
        index:392
    },
    {
        site:"Lower leg",
        index:397
    },
    {
        site:"Ankle",
        index:402
    },
    {
        site:"Foot",
        index:409
    }
]