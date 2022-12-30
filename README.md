# Loopback Neptune Connector App

## Get started

To run the app you should clone the repo, provide your own `encore_main.pem` file, and run `docker-compose up`. This launches an app connected to Encore's Neptune development  DB. Following are step by step details:

```shell
# Clone the repo
git clone git@github.com:CrypTixEncore/loopback-neptune-connector.git
cd loopback-neptune-connector

# Add your own encore_main.pem file
cp ~/.ssh/encore_main.pem .

# Launch the App
docker-compose up
```

Then, open the browser and navigate to App at http://127.0.0.1:3000. As you can notice, the API is similar to our model, with people following people.

## The App

The App launches a backend with the following Controllers:

![image](https://user-images.githubusercontent.com/86032/209563417-10880b3a-1cde-40e0-a902-0bb62262e2f9.png)

Each Controller handles operations from some entity, including its corresponding vertex & edges at the graph model. For example, the **People** Controller includes several endpoints, as shown below:

![image](https://user-images.githubusercontent.com/86032/209560598-9753a98a-dc59-4727-91a9-6f18f3ab5c4d.png)


By default all CRUD methods are supported. The App applies Loopback repository libraries to provide CRUD, establishing a nice pattern that satisfies most of the basic endpoints. Gremlin Traversal Steps are the best way to use a GraphDB in full capacity, running direct queries against AWS Neptune.


### Specialized Endpoints

For more specialized endpoints there is **Gremlin for Javascript** that converts commands into bytecode. With that, you can write complex and platform agnostic queries to efficiently navigate highly connected datasets, and use those data for social platforms, machine learning, and many other applications that requires complex related data.

At current People Controller we can find both options: `promise` & `bytecode`. Please see the details below.

#### Controller

```typescript
  async findFollowerGreaterThanAgePromise(
      @param.query.number('age') age: number,
  ): Promise<AnyObject> {
    return this.peopleRepository.findFollowerGreaterThanAgePromise(age);
  }

  @get('/people/bytecode-followers-greater-than')
  @response(200, {
    description: 'Get followers by age',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(People),
        },
      },
    },
  })
  async findFollowerGreaterThanAgeBytecode(
      @param.query.number('age') age: number,
  ): Promise<AnyObject> {
    return this.peopleRepository.findFollowerGreaterThanAgeBytecode(age);
  }
```
#### Repository

```typescript
  async findFollowerGreaterThanAgePromise(age: number) {

    const promise = this.g.V().hasLabel('People').out("Follow").has('age', this.P.gt(age)).elementMap().dedup().order().by('age', this.order.asc).toList();

    const res = await this.execute(promise);

    return res;

  }

  async findFollowerGreaterThanAgeBytecode(age: number) {

    const bytecode = this.g.V().hasLabel('People').out("Follow").has('age', this.P.gt(age)).elementMap().dedup().order().by('age', this.order.asc);

    const res = await this.execute(bytecode, null, { method: 'toList' });

    return res;

  }
```

## Limitations

- This connector only support one primary key (index), and it MUST be called `id` immutably.
- In edge models you MUST inform two additional fields called `from` and `to`. You can use any property name, but the database column name is immutable.
- You can set relations between models, but, we strongly recommend NOT to use relations on Loopback queries. Use Direct Query Execution (Gremlin Bytecode) instead, when querying relations from Neptune.

There are some NOT supported Loopback data type in this connector, see the full list below:

- any: Not supported
- array: Will be stored as string and parsed back to array
- Boolean: Will be forcibly converted to boolean
- buffer: Not supported.
- date: Not supported. Use Date instead
- GeoPoint: Not supported
- Date: Will be forcibly converted to date
- null: Not Supported
- number: Will be forcibly converted to number. Will store NaN if it's not - convertible
- Object: Will be stored as string and parsed back to object
- String: Will be forcibly converted to string

Keep in mind that the term `Transaction` in the DB refers to AWS Neptune Documentation [Multithreaded Gremlin Writes](https://docs.aws.amazon.com/neptune/latest/userguide/best-practices-gremlin-multithreaded-writes.html) and can only be used for written operations.