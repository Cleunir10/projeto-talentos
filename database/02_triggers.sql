-- Talentos Marketplace - Triggers e Funções
-- Automações e regras de negócio

-- =======================================================
-- 1. FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =======================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =======================================================
-- 2. TRIGGERS PARA UPDATED_AT
-- =======================================================

-- Profiles
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Endereços
CREATE TRIGGER update_enderecos_updated_at 
    BEFORE UPDATE ON public.enderecos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Costureiras
CREATE TRIGGER update_costureiras_updated_at 
    BEFORE UPDATE ON public.costureiras 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Categorias
CREATE TRIGGER update_categorias_updated_at 
    BEFORE UPDATE ON public.categorias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Produtos
CREATE TRIGGER update_produtos_updated_at 
    BEFORE UPDATE ON public.produtos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Variações
CREATE TRIGGER update_produto_variacoes_updated_at 
    BEFORE UPDATE ON public.produto_variacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Pedidos
CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON public.pedidos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Itens do pedido
CREATE TRIGGER update_pedido_itens_updated_at 
    BEFORE UPDATE ON public.pedido_itens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Carrinho
CREATE TRIGGER update_carrinho_updated_at 
    BEFORE UPDATE ON public.carrinho 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Configurações
CREATE TRIGGER update_configuracoes_updated_at 
    BEFORE UPDATE ON public.configuracoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =======================================================
-- 3. FUNÇÃO PARA GERAR NÚMERO DE PEDIDO
-- =======================================================

CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS TRIGGER AS $$
DECLARE
    contador INTEGER;
    ano_atual TEXT;
    numero_gerado TEXT;
BEGIN
    -- Obter o ano atual
    ano_atual := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Contar pedidos do ano atual
    SELECT COUNT(*) + 1 INTO contador
    FROM public.pedidos 
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    -- Gerar número no formato TAL2024000001
    numero_gerado := 'TAL' || ano_atual || LPAD(contador::TEXT, 6, '0');
    
    NEW.numero_pedido := numero_gerado;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para gerar número do pedido
CREATE TRIGGER trigger_gerar_numero_pedido
    BEFORE INSERT ON public.pedidos
    FOR EACH ROW
    WHEN (NEW.numero_pedido IS NULL)
    EXECUTE FUNCTION gerar_numero_pedido();

-- =======================================================
-- 4. FUNÇÃO PARA ATUALIZAR MÉDIA DE AVALIAÇÕES DOS PRODUTOS
-- =======================================================

CREATE OR REPLACE FUNCTION atualizar_media_avaliacoes_produto()
RETURNS TRIGGER AS $$
DECLARE
    media_calc DECIMAL(3,2);
    total_calc INTEGER;
BEGIN
    -- Calcular nova média e total
    SELECT 
        ROUND(AVG(nota)::DECIMAL, 2),
        COUNT(*)
    INTO media_calc, total_calc
    FROM public.avaliacoes_produto
    WHERE produto_id = COALESCE(NEW.produto_id, OLD.produto_id);
    
    -- Atualizar produto
    UPDATE public.produtos 
    SET 
        avaliacoes_media = COALESCE(media_calc, 0),
        total_avaliacoes = COALESCE(total_calc, 0)
    WHERE id = COALESCE(NEW.produto_id, OLD.produto_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers para atualizar média de avaliações
CREATE TRIGGER trigger_atualizar_media_produto_insert
    AFTER INSERT ON public.avaliacoes_produto
    FOR EACH ROW EXECUTE FUNCTION atualizar_media_avaliacoes_produto();

CREATE TRIGGER trigger_atualizar_media_produto_update
    AFTER UPDATE ON public.avaliacoes_produto
    FOR EACH ROW EXECUTE FUNCTION atualizar_media_avaliacoes_produto();

CREATE TRIGGER trigger_atualizar_media_produto_delete
    AFTER DELETE ON public.avaliacoes_produto
    FOR EACH ROW EXECUTE FUNCTION atualizar_media_avaliacoes_produto();

-- =======================================================
-- 5. FUNÇÃO PARA ATUALIZAR MÉDIA DE AVALIAÇÕES DAS COSTUREIRAS
-- =======================================================

CREATE OR REPLACE FUNCTION atualizar_media_avaliacoes_costureira()
RETURNS TRIGGER AS $$
DECLARE
    media_calc DECIMAL(3,2);
    total_calc INTEGER;
BEGIN
    -- Calcular nova média e total
    SELECT 
        ROUND(AVG(nota)::DECIMAL, 2),
        COUNT(*)
    INTO media_calc, total_calc
    FROM public.avaliacoes_costureira
    WHERE costureira_id = COALESCE(NEW.costureira_id, OLD.costureira_id);
    
    -- Atualizar costureira
    UPDATE public.costureiras 
    SET 
        avaliacoes_media = COALESCE(media_calc, 0),
        total_avaliacoes = COALESCE(total_calc, 0)
    WHERE id = COALESCE(NEW.costureira_id, OLD.costureira_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers para atualizar média de avaliações das costureiras
CREATE TRIGGER trigger_atualizar_media_costureira_insert
    AFTER INSERT ON public.avaliacoes_costureira
    FOR EACH ROW EXECUTE FUNCTION atualizar_media_avaliacoes_costureira();

CREATE TRIGGER trigger_atualizar_media_costureira_update
    AFTER UPDATE ON public.avaliacoes_costureira
    FOR EACH ROW EXECUTE FUNCTION atualizar_media_avaliacoes_costureira();

CREATE TRIGGER trigger_atualizar_media_costureira_delete
    AFTER DELETE ON public.avaliacoes_costureira
    FOR EACH ROW EXECUTE FUNCTION atualizar_media_avaliacoes_costureira();

-- =======================================================
-- 6. FUNÇÃO PARA CONTROLAR ESTOQUE
-- =======================================================

CREATE OR REPLACE FUNCTION controlar_estoque_produto()
RETURNS TRIGGER AS $$
BEGIN
    -- Ao confirmar um pedido, reduzir o estoque
    IF NEW.status = 'confirmado' AND OLD.status = 'pendente' THEN
        UPDATE public.produtos 
        SET estoque = estoque - NEW.quantidade
        WHERE id = NEW.produto_id AND estoque >= NEW.quantidade;
        
        -- Verificar se o estoque foi atualizado
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Estoque insuficiente para o produto %', NEW.produto_id;
        END IF;
    END IF;
    
    -- Ao cancelar um pedido, devolver o estoque
    IF NEW.status_item = 'cancelado' AND OLD.status_item != 'cancelado' THEN
        UPDATE public.produtos 
        SET estoque = estoque + OLD.quantidade
        WHERE id = OLD.produto_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para controle de estoque
CREATE TRIGGER trigger_controlar_estoque
    AFTER UPDATE ON public.pedido_itens
    FOR EACH ROW EXECUTE FUNCTION controlar_estoque_produto();

-- =======================================================
-- 7. FUNÇÃO PARA LOGS DE ATIVIDADE
-- =======================================================

CREATE OR REPLACE FUNCTION registrar_log_atividade()
RETURNS TRIGGER AS $$
DECLARE
    acao_realizada TEXT;
    tabela_nome TEXT;
    user_id_atual UUID;
BEGIN
    -- Determinar a ação
    IF TG_OP = 'INSERT' THEN
        acao_realizada := 'INSERT';
    ELSIF TG_OP = 'UPDATE' THEN
        acao_realizada := 'UPDATE';
    ELSIF TG_OP = 'DELETE' THEN
        acao_realizada := 'DELETE';
    END IF;
    
    -- Nome da tabela
    tabela_nome := TG_TABLE_NAME;
    
    -- Tentar obter o user_id do contexto (definido pela aplicação)
    user_id_atual := current_setting('app.current_user_id', true)::UUID;
    
    -- Inserir log
    INSERT INTO public.logs_atividade (
        user_id,
        acao,
        tabela_afetada,
        registro_id,
        dados_anteriores,
        dados_novos
    ) VALUES (
        user_id_atual,
        acao_realizada,
        tabela_nome,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- =======================================================
-- 8. FUNÇÃO PARA VALIDAR APENAS UM ENDEREÇO PRINCIPAL
-- =======================================================

CREATE OR REPLACE FUNCTION validar_endereco_principal()
RETURNS TRIGGER AS $$
BEGIN
    -- Se está marcando como principal, desmarcar os outros
    IF NEW.is_principal = true THEN
        UPDATE public.enderecos 
        SET is_principal = false 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para validar endereço principal
CREATE TRIGGER trigger_validar_endereco_principal
    BEFORE INSERT OR UPDATE ON public.enderecos
    FOR EACH ROW 
    WHEN (NEW.is_principal = true)
    EXECUTE FUNCTION validar_endereco_principal();

-- =======================================================
-- 9. FUNÇÃO PARA NOTIFICAÇÕES AUTOMÁTICAS
-- =======================================================

CREATE OR REPLACE FUNCTION criar_notificacao_automatica()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificação quando um pedido é criado
    IF TG_TABLE_NAME = 'pedidos' AND TG_OP = 'INSERT' THEN
        -- Notificar cliente
        INSERT INTO public.notificacoes (user_id, tipo, titulo, mensagem)
        VALUES (
            NEW.cliente_id,
            'pedido_criado',
            'Pedido realizado com sucesso!',
            'Seu pedido ' || NEW.numero_pedido || ' foi criado e está sendo processado.'
        );
        
        -- Notificar costureiras dos itens
        INSERT INTO public.notificacoes (user_id, tipo, titulo, mensagem)
        SELECT DISTINCT 
            pi.costureira_id,
            'novo_pedido',
            'Você tem um novo pedido!',
            'Pedido ' || NEW.numero_pedido || ' aguarda sua confirmação.'
        FROM public.pedido_itens pi
        WHERE pi.pedido_id = NEW.id;
    END IF;
    
    -- Notificação quando status do pedido muda
    IF TG_TABLE_NAME = 'pedidos' AND TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.notificacoes (user_id, tipo, titulo, mensagem)
        VALUES (
            NEW.cliente_id,
            'status_pedido',
            'Status do pedido atualizado',
            'Seu pedido ' || NEW.numero_pedido || ' agora está: ' || NEW.status
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para notificações automáticas
CREATE TRIGGER trigger_notificacao_pedido_insert
    AFTER INSERT ON public.pedidos
    FOR EACH ROW EXECUTE FUNCTION criar_notificacao_automatica();

CREATE TRIGGER trigger_notificacao_pedido_update
    AFTER UPDATE ON public.pedidos
    FOR EACH ROW EXECUTE FUNCTION criar_notificacao_automatica();

-- =======================================================
-- 10. FUNÇÃO PARA ATUALIZAR CONTADORES DE VENDAS
-- =======================================================

CREATE OR REPLACE FUNCTION atualizar_contadores_vendas()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando um pedido é entregue, atualizar contadores
    IF NEW.status = 'entregue' AND OLD.status != 'entregue' THEN
        -- Atualizar total de vendas dos produtos
        UPDATE public.produtos 
        SET vendas_total = vendas_total + pi.quantidade
        FROM public.pedido_itens pi
        WHERE produtos.id = pi.produto_id AND pi.pedido_id = NEW.id;
        
        -- Atualizar total de vendas das costureiras
        UPDATE public.costureiras 
        SET total_vendas = total_vendas + 1
        FROM public.pedido_itens pi
        WHERE costureiras.id = pi.costureira_id AND pi.pedido_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar contadores
CREATE TRIGGER trigger_atualizar_contadores_vendas
    AFTER UPDATE ON public.pedidos
    FOR EACH ROW EXECUTE FUNCTION atualizar_contadores_vendas();
