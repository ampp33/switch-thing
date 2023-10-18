import { supabase } from "./supabase"
import { switchNameToSlug } from './util.js'
import { diff } from "jsondiffpatch"

/*
REFERENCE:
supabase error message schema (typically): {
    name,
    message,
    status
}
*/

async function getUsername(user_id) {
    const { data, error } = await supabase
            .from('public_user_data')
            .select('username')
            .eq('user_id', user_id)

    return (!error && data && data.length > 0) ? data[0].username : null
}

async function getSearchFields() {
    let { data, error } = await supabase
        .from('switch_search')
        .select('name, company, manufacturer, type, spring_weight, spring_type, stem_material, bottom_material, top_material')
    
    if(error) {
        return null
    }

    const name = new Set()
    const company = new Set()
    const manufacturer = new Set()
    const type = new Set()
    const spring_weight = new Set()
    const spring_type = new Set()
    const stem_material = new Set()
    const bottom_material = new Set()
    const top_material = new Set()

    for(const row of data) {
        if(row['name']) name.add(row['name'])
        if(row['company']) company.add(row['company'])
        if(row['manufacturer']) manufacturer.add(row['manufacturer'])
        if(row['type']) type.add(row['type'])
        if(row['spring_weight']) spring_weight.add(row['spring_weight'])
        if(row['spring_type']) spring_type.add(row['spring_type'])
        if(row['stem_material']) stem_material.add(row['stem_material'])
        if(row['bottom_material']) bottom_material.add(row['bottom_material'])
        if(row['top_material']) top_material.add(row['top_material'])
    }

    const sortedStringArray = (set) => Array.from(set).sort()
    const sortedNumberArray = (set) => Array.from(set).sort((a,b) => a - b)

    return {
        name: sortedStringArray(name),
        company: sortedStringArray(company),
        manufacturer: sortedStringArray(manufacturer),
        type: sortedStringArray(type),
        spring_weight: sortedNumberArray(spring_weight),
        spring_type: sortedStringArray(spring_type),
        stem_material: sortedStringArray(stem_material),
        bottom_material: sortedStringArray(bottom_material),
        top_material: sortedStringArray(top_material),
    }
}

async function search({name, company, manufacturer, type, description, min_weight, max_weight, stem_material, top_material, bottom_material}) {
    const trimAndLower = (text) => text.toLowerCase().trim()
    
    const query = supabase
                    .from('switch_search')
                    .select('name, type, spring_weight, stem_material, top_material, '
                                + 'bottom_material, stem_color, top_housing_color, bottom_housing_color, '
                                + 'switch ( slug )')

    if(name) query.ilike('name', `%${name.trim()}%`)
    if(description) query.ilike('description', `%${description.trim()}%`)
    if(company) query.eq('company', trimAndLower(company))
    if(manufacturer) query.eq('manufacturer', trimAndLower(manufacturer))
    if(type) query.eq('type', trimAndLower(type))
    if(min_weight) query.gte('spring_weight', min_weight)
    if(max_weight) query.lte('spring_weight', max_weight)
    if(stem_material) query.eq('stem_material', trimAndLower(stem_material))
    if(top_material) query.eq('top_material', trimAndLower(top_material))
    if(bottom_material) query.eq('bottom_material', trimAndLower(bottom_material))

    let { data, error } = await query

    if(error) {
        console.error(error)
        return null
    }

    // remove duplicates and collect color combos (supabase also can't select distinct lol)
    const allSwitchesObj
        = data.reduce((acc, row) => {
            if(acc[row.switch.slug]) {
                // entry for this switch already exists, so don't add it again
                // but add the color option to the colors list
                const { stem_color, top_housing_color, bottom_housing_color } = row
                const colorCombos = acc[row.switch.slug].colorCombos
                // only add the color combo if it's not already in the list
                if(!colorCombos.find(item =>
                    item.stem_color == stem_color
                    && item.top_housing_color == top_housing_color
                    && item.bottom_housing_color == bottom_housing_color
                )) colorCombos.push()
                return acc
            }

            const {
                    name, type, spring_weight, stem_material, top_material, bottom_material, switch: { slug },
                    stem_color, top_housing_color, bottom_housing_color
            } = row
            acc[row.switch.slug] = {
                name, type, weight: spring_weight, stem_material, top_material, bottom_material, slug,
                colorCombos: [{
                    stem_color,
                    top_housing_color,
                    bottom_housing_color
                }]
            }
            return acc
        }, {})
    return Object.entries(allSwitchesObj).map(( [k, v] ) => v)
}

async function getSwitch(slug) {
    const { data, error }
        = await supabase.rpc('select_switch', {
                    slug
                })

    if(data && data.length > 0) {
        const { id, version, data: switchData, updated_ts, update_user, create_user } = data[0]
        return {
            data: {
                id,
                version,
                data: switchData,
                updated_ts: updated_ts ? new Date(updated_ts) : null,
                update_user,
                create_user
            }
        }
    }

    if(error) {
        return {
            error: {
                public: false,
                ...error
            }
        }
    }

    return {}
}

async function createSwitch(switchData, authorUserId) {
    // inserts switch into switch table and adds an entry into the history table
    const { data, error }
        = await supabase.rpc('create_switch', {
                    slug: switchNameToSlug(switchData.name),
                    data: switchData,
                    updated_by: authorUserId
                })

    return { data, error }
}

async function updateSwitch(switchId, currentSwitchVersion, previousSwitchData, switchData, userId) {
    const jsondiff = diff(previousSwitchData, switchData)

    if(jsondiff == null) {
        // TODO change this object to match the schema of the 
        return {
            error: {
                public: true,
                message: 'No changes detected'
            }
        }
    }

    const { error }
        = await supabase.rpc('update_switch', {
                    slug: switchNameToSlug(switchData.name),
                    data: switchData,
                    updated_by: userId,
                    switch_id: switchId,
                    current_version: currentSwitchVersion,
                    diff: jsondiff
                })

    if(error) {
        return {
            error: {
                ...error,
                public: false
            }
        }
    }

    return {}
}

export {
    getSearchFields,
    search,
    getSwitch,
    createSwitch,
    updateSwitch
}