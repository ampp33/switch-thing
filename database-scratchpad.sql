BEGIN
  delete from switch_search where switch_id = NEW.id;

  insert into switch_search
  (switch_id, name, company, manufacturer, type, actuation, stem_material, bottom_material, top_material)
  select distinct
    NEW.id,
    NEW.data ->> 'name' as type,
    jsonb_array_elements_text(NEW.data -> 'company'),
    NEW.data ->> 'manufacturer' as manufacturer,
    NEW.data ->> 'type' as type,
    CAST (jsonb_array_elements(NEW.data -> 'specs') ->> 'actuation' AS NUMERIC) as actuation,
    jsonb_array_elements(NEW.data -> 'specs') -> 'stem' ->> 'material' as stem_material,
    jsonb_array_elements(NEW.data -> 'specs') -> 'bottom_housing' ->> 'material' as bottom_material,
    jsonb_array_elements(NEW.data -> 'specs') -> 'top_housing' ->> 'material' as top_material;
  RETURN NEW;
END




    const { data, error } = await supabase
                                    .from('switch')
                                    .insert({
                                        slug: switchNameToSlug(switchData.name),
                                        data: switchData,
                                        updated_ts: new Date(),
                                        updated_by: authorUserId
                                    })

-- create_switch
BEGIN
  INSERT INTO SWITCH
  (slug, data, updated_ts, updated_by)
  VALUES
  (create_switch.slug, create_switch.data, now(), create_switch.updated_by)
  RETURNING ID INTO new_id;

  INSERT INTO SWITCH_HISTORY
  (switch_id, version, diff, updated_ts, updated_by)
  VALUES
  (new_id, 1, create_switch.data, now(), create_switch.updated_by);

  RETURN new_id;
END;




-- update_switch
-- switch_id - int
-- current_version - int
-- slug - text
-- data - jsonb
-- diff - jsonb
-- updated_by - uuid

DECLARE version_in_db integer;
DECLARE current_ts timestamptz;
BEGIN
  -- get current switch version in db
  SELECT MAX(version) INTO version_in_db
  FROM switch_history
  WHERE switch_history.switch_id = update_switch.switch_id;

  -- verify version passed in matches version in db,
  -- to verify that someone hasn't updated the switch
  -- since the switch was last pulled from the db
  IF version_in_db != update_switch.current_version THEN
    RAISE EXCEPTION 'switch versions do not match';
  END IF;

  -- put current time in a variable, so the timestamp will
  -- match between the switch and switch_history table
  SELECT now() INTO current_ts;

  -- update switch data (which will also run a trigger
  -- and update the switch_indexes table)
  UPDATE switch
  SET version = version_in_db + 1,
  slug = update_switch.slug,
  data = update_switch.data,
  updated_ts = current_ts,
  updated_by = update_switch.updated_by
  WHERE
  id = update_switch.switch_id;

  INSERT INTO switch_history
  (switch_id, version, diff, updated_ts, updated_by, event_type)
  VALUES
  (update_switch.switch_id, version_in_db + 1, diff, current_ts, update_switch.updated_by, 'U');
END;




drop function select_switch;

create or replace function select_switch(slug text)
  returns table (id integer, version integer, data jsonb, updated_ts timestamptz, update_user text, create_user text) AS
$$
  SELECT
    s.id,
    s.version,
    s.data,
    s.updated_ts,
    updated_user.username as update_user,
    create_user.username as create_user
  FROM
    switch s
  LEFT JOIN
    public_user_data updated_user
      ON
        updated_user.user_id = s.updated_by
  -- left join because this first record only exists for switches created manually by users,
  -- not the initial switches the system was created with
  LEFT JOIN
    switch_history sh
      ON
        sh.switch_id = s.id
        AND sh.version = 1
        AND sh.event_type = 'N'
  -- see above comment for reason of LEFT JOIN here
  LEFT JOIN
    public_user_data create_user
      ON
        create_user.user_id = sh.updated_by
  WHERE
    s.slug = select_switch.slug;
$$ LANGUAGE SQL;




CREATE POLICY "policy_name"
ON public.public_user_data
FOR INSERT USING (
  auth.uid() = user_id
)  WITH CHECK (
  auth.uid() = user_id
);




BEGIN
  delete from switch_search where switch_id = NEW.id;

  insert into switch_search
  (
    switch_id, name, company, manufacturer, type, actuation,
    spring_type, stem_material, bottom_material, top_material,
    stem_color, top_housing_color, bottom_housing_color)
  select distinct
    NEW.id,
    NEW.data ->> 'name' as type,
    jsonb_array_elements_text(NEW.data -> 'company'),
    NEW.data ->> 'manufacturer' as manufacturer,
    NEW.data ->> 'type' as type,
    CAST (jsonb_array_elements(NEW.data -> 'specs') ->> 'actuation' AS NUMERIC) as actuation,
    jsonb_array_elements(NEW.data -> 'specs') ->> 'spring' as spring_type,
    jsonb_array_elements(NEW.data -> 'specs') -> 'stem' ->> 'material' as stem_material,
    jsonb_array_elements(NEW.data -> 'specs') -> 'bottom_housing' ->> 'material' as bottom_material,
    jsonb_array_elements(NEW.data -> 'specs') -> 'top_housing' ->> 'material' as top_material,
        jsonb_array_elements(NEW.data -> 'specs') -> 'stem' ->> 'color' as stem_color,
    jsonb_array_elements(NEW.data -> 'specs') -> 'top_housing' ->> 'color' as top_housing_color,
    jsonb_array_elements(NEW.data -> 'specs') -> 'bottom_housing' ->> 'color' as bottom_housing_color;
  RETURN NEW;
END