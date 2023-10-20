const input = {
    "name": "Akko CS Lavender Purple",
    "type": "tactile",
    "mount": "3",
    "specs": [
      {
        "stem": {
          "color": "rgba(138 92 158 / 1)",
          "length": "long",
          "material": "pom",
          "custom_material_notes": ""
        },
        "spring": {
          "type": "extension",
          "color": "#616160",
          "material": "stainless-steel",
          "actuation_weight": 36,
          "pre_travel_distance": 1.9,
          "total_travel_distance": 3.5
        },
        "top_housing": {
          "color": "rgba(195 172 206 / 0.5)",
          "material": "pc",
          "custom_material_notes": ""
        },
        "bottom_housing": {
          "color": "rgba(138 92 158 / 1)",
          "material": "nylon",
          "custom_material_notes": ""
        }
      }
    ],
    "prices": [
      {
        "url": "https://en.akkogear.com/product/akko-cs-lavender-purple-switch-45pcs/"
      }
    ],
    "company": [
      "akko"
    ],
    "description": "Akko and KTT worked together to produce a different top housing mold inorder to prevent north facing interference with cherry keycaps.",
    "limited_run": false,
    "manufacturer": "ktt",
    "factory_lubed": "slight"
  }

const recursive = (parent, key, currentValue, handler) =>  {
    if(typeof currentValue == 'array') for(const item of currentValue) recursive(currentValue, null, item, handler)
    else if(typeof currentValue == 'object') for(const key in currentValue) recursive(currentValue, key, currentValue[key], handler)
    else handler(parent, key, currentValue)
}

recursive(null, null, input, (parent, key, value) => {
    parent[key] = {
        value,
        refs: []
    }
})

console.log(JSON.stringify(input))