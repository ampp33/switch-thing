import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://ewyadmgrlvomqgsyrtqz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eWFkbWdybHZvbXFnc3lydHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUxNjg2MTQsImV4cCI6MjAxMDc0NDYxNH0.im8OWXoDEQXJiCiyiK1g4j7yIySUzs-FUlfBDgOvyhw'
)

export {
    supabase
}