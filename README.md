# Mikanarr

*Mikanarr* is a blend of *Mikan Anime* and *Sonarr*, mainly convert RSS feed from Mikan Anime to a format that Sonarr will accept.

## Transformation

**TBD**

## Database

A simple database is used to translate Chinese (and potentially weirdly-shaped) titles to English ones so that Sonarr will grab them.

This also serves the purpose to filter out undesired items (e.g. ad or multiple versions of one episode) by matching titles against a regular expression which ideally will meet all requirements.

The database is in `database.js` and its type definition is simply: 

```ts
[
    {
        pattern: string,
        series: string,
        season: string,
    }
]
```

The `pattern` field should be a regex (with characters properly escaped) and contains a named capture `episode` which is used to construct the final title, along with the other fields.
