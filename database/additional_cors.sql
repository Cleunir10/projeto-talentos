-- Função adicional para garantir headers CORS em queries
CREATE OR REPLACE FUNCTION public.set_cors_headers()
RETURNS event_trigger AS $$
BEGIN
    PERFORM set_config(
        'response.headers',
        jsonb_build_object(
            'Access-Control-Allow-Origin', current_setting('request.header.origin', true),
            'Access-Control-Allow-Credentials', 'true',
            'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, Origin, X-Requested-With'
        )::text,
        false
    );
END;
$$ LANGUAGE plpgsql;
