# User Service (doc for dev)

```cli
nvm use 18.15.0
```

It's a concept of encapsultating APIs from back-end. Via centralized management of APIs, create a service that is similar with NestJS's MVC design pattern.

## API design

### core

#### us

- us.createService(ServcieConfig)

```ts
import { createService } from 'us'

const userService = createService()
```

#### ro

- ro.partial()
- ro.required()
- ro.pick()
- ro.omit()
- ro.extract()
- ro.merge()
- ro.declareType()
- ro.declareUnion()
- ro.declareIntersection()
