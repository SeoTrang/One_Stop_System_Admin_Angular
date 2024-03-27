export class CreateService {
    constructor(
        public name: string,
        public type: string,
        public time_handle: string,
        public department_id: number,
        public description?: string
    ) {}
}

export class CreateFormFile {
    constructor(
        public link: string,
        public serviceId: number,
        public departmentId: number
    ) {}
}

export class CreateProceduralStep {
    constructor(
        public step: number,
        public department_id: number,
        public service_id: number
    ) {}
}

export class CreateAttribute {
    constructor(
        public name: string,
        public type: string,
        public service_id: number
    ) {}
}

export class CreateAttributeFormEnum {
    constructor(
        public name: string
    ) {}
}
