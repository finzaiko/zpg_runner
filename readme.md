# ZPGRUNNER


Postgres backup file to local


### Requirement

Postgres version 9.6 or above

### Install 
```
npm i -g zpgrunner
```

### Uninstall global
```
npm uninstall -g zpgrunner
```

### Usage

#### Create config file: `config.json`
```
{
  "project_name": "you_project_name",
  "path": "/path/to/store",
  "db": {
    "host": "localhost",
    "user": "db_user",
    "password": "db_pass",
    "database": "db_name",
    "port": "5432"
  },
  "schema_exclude": ["logdata%"]
}
```

#### Execute current path (config.json)
```
zpgrunner x
```

#### Execute specific path
```
zpgrunner p /home/user/development/config_db_sales.json
```

Developed by: Finzaiko
