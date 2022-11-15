# React gate scheduler

World's most lightweight and modern gate scheduling tool!

![Demo of the project](demo/demo.gif?raw=true "Demo of the project")


# Running with mock data
This project is ofcourse intended to be connected to some backend. However, to run a demo of this project locally you can use the mock data provided in combination with the awesome package [json-server](https://www.npmjs.com/package/json-server).

```shell
$ npm install -g json-server
$ json-server --watch ./mock_data/db.json
```

This runs a mock server whith the following endpoints:
- `/gateConfig`
- `/turnarounds`
- `/turnarounds/{id}`

Starting the project now will use these endpoints by default.