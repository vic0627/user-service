import "reflect-metadata";
import IOCContainer from "./decorator/IOCContainer";
import Injectable from "./decorator/Injectable";
import Expose from "./decorator/Expose";

class Provide1 {
    prop = "provide1";
}

class Provide2 {
    prop = "provide2";
}

class Provide3 {
    prop = "provide3";
}

class Provide4 {
    prop = "provide4";
}

@Expose()
@Injectable()
class Inject2 {
    constructor(private readonly provide1: Provide1) {}

    print() {
        console.log(this.provide1.prop);
    }
}

@Expose()
@Injectable()
class Inject1 {
    constructor(
        private readonly provide2: Provide2,
        private readonly provide4: Provide4,
        private readonly inject2: Inject2
    ) {}

    print(str: string) {
        console.log(str);
    }

    getProp() {
        this.print(this.provide2.prop);
    }
}

@IOCContainer({
    provides: [Provide1, Provide2, Provide4, Provide3],
    imports: [Inject1, Inject2],
})
class Module {
    constructor() {}
}

export default Module;
