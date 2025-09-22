-- Add computed geography point and spatial index for venues
alter table "Venue"
add column if not exists geog geography(Point,4326)
generated always as (
  ST_SetSRID(ST_MakePoint("lng","lat"),4326)::geography
) stored;

create index if not exists venue_geog_gix on "Venue" using gist(geog);
