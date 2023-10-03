import { supabase } from "./supabase"
import { switchNameToSlug } from './util.js'
import { diff } from "jsondiffpatch"

async function getSearchFields() {
    let { data, error } = await supabase
        .from('switch_search')
        .select('company, manufacturer, type, actuation, stem_material, bottom_material, top_material')
    
    if(error) {
        return null
    }

    const company = new Set()
    const manufacturer = new Set()
    const type = new Set()
    const actuation = new Set()
    const stem_material = new Set()
    const bottom_material = new Set()
    const top_material = new Set()

    for(const row of data) {
        if(row['company']) company.add(row['company'])
        if(row['manufacturer']) manufacturer.add(row['manufacturer'])
        if(row['type']) type.add(row['type'])
        if(row['actuation']) actuation.add(row['actuation'])
        if(row['stem_material']) stem_material.add(row['stem_material'])
        if(row['bottom_material']) bottom_material.add(row['bottom_material'])
        if(row['top_material']) top_material.add(row['top_material'])
    }

    const sortedStringArray = (set) => Array.from(set).sort()
    const sortedNumberArray = (set) => Array.from(set).sort((a,b) => a - b)

    return {
        company: sortedStringArray(company),
        manufacturer: sortedStringArray(manufacturer),
        type: sortedStringArray(type),
        actuation: sortedNumberArray(actuation),
        stem_material: sortedStringArray(stem_material),
        bottom_material: sortedStringArray(bottom_material),
        top_material: sortedStringArray(top_material),
    }
}

async function search({name, company, manufacturer, type, description, min_weight, max_weight, stem_material, top_material, bottom_material}) {
    const trimAndLower = (text) => text.toLowerCase().trim()
    
    const query = supabase.from('switch_search').select('name, type, actuation, stem_material, top_material, bottom_material, switch ( slug )')

    if(name) query.ilike('name', `%${name.trim()}%`)
    if(description) query.ilike('description', `%${description.trim()}%`)
    if(company) query.eq('company', trimAndLower(company))
    if(manufacturer) query.eq('manufacturer', trimAndLower(manufacturer))
    if(type) query.eq('type', trimAndLower(type))
    if(min_weight) query.lte('actuation', min_weight)
    if(max_weight) query.gte('actuation', max_weight)
    if(stem_material) query.eq('stem_material', trimAndLower(stem_material))
    if(top_material) query.eq('top_material', trimAndLower(top_material))
    if(bottom_material) query.eq('bottom_material', trimAndLower(bottom_material))

    let { data, error } = await query

    if(error) {
        console.error(error)
        return null
    }

    const switchSlugs = new Set()

    // remove duplicates (funky supabase thing)
    return data.map(row => {
        if(switchSlugs.has(row.switch.slug)) return null
        switchSlugs.add(row.switch.slug)
        const { name, type, actuation, stem_material, top_material, bottom_material, switch: { slug } } = row
        return {
            name, type, weight: actuation, stem_material, top_material, bottom_material, slug
        }
    }).filter(swtch => swtch != null)
}

async function getSwitch(slug) {
    const { data } = await supabase.from('switch').select('version, data').eq('slug', slug)
    const switchData = data && data.length > 0 ? data[0].data : {}
    const version = data && data.length > 0 ? data[0].version : 1
    return {
        version,
        data: switchData
    }
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
    const diff = diff(previousSwitchData, switchData)

    const { data, error }
        = await supabase.rpc('update_switch', {
                    switch_id: switchId,
                    current_version: currentSwitchVersion,
                    slug: switchNameToSlug(switchData.name),
                    data: switchData,
                    diff,
                    updated_by: userId
                })

    return { data, error }
}

export {
    getSearchFields,
    search,
    getSwitch,
    createSwitch,
    updateSwitch
}