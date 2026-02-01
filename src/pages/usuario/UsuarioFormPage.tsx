import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { AuthContext } from '../../contexts';
import { TemaService, UsuarioService } from '../../service';
import { Usuario, UsuarioForm } from '../../types';
import { IMG_PERFIL_PADRAO } from '../../utils';
import { ThemeSelector, Tema, Container, Panel, Stack, FieldValue, ImagePicker, ActionButton, Loading, useMessage } from 'lcano-react-ui';
import { MdCameraAlt } from 'react-icons/md';

export const UsuarioFormPage: React.FC = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [usuarioForm, setUsuarioForm] = useState<UsuarioForm | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [imagemPerfil, setImagemPerfil] = useState<string>(IMG_PERFIL_PADRAO);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  
  const blobRef = useRef<Blob | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  
  const auth = useContext(AuthContext);
  const message = useMessage(); 

  const cleanupBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  useEffect(() => {
    if (auth.usuario) {
      loadTemas();
      convertAndSetUsuarioForm(auth.usuario);
    }
  }, [auth.usuario]);
  
  useEffect(() => {
    const fetchArquivo = async () => {
      if (!auth.usuario?.token) return;
      
      setIsLoadingImage(true);
      try {
        if (usuarioForm?.file) {
          cleanupBlobUrl();
          blobRef.current = usuarioForm.file;
          blobUrlRef.current = URL.createObjectURL(usuarioForm.file);
          setImagemPerfil(blobUrlRef.current);
        } else if (auth.usuario.icone) {
          setImagemPerfil(`data:image/png;base64,${auth.usuario.icone}`);
        } else {
          setImagemPerfil(IMG_PERFIL_PADRAO);
        }
      } catch (error) {
        message.showErrorWithLog('Erro ao carregar o arquivo.', error);
        setImagemPerfil(IMG_PERFIL_PADRAO);
      } finally {
        setIsLoadingImage(false);
      }
    };
  
    fetchArquivo();
    return () => {
      cleanupBlobUrl();
    };
  }, [auth.usuario?.icone, usuarioForm?.file]);
  
  const loadTemas = async () => {
    if (!auth.usuario?.token) return;

    try {
      const result = await TemaService.getTemas(auth.usuario.token);
      if (result) setTemas(result);
    } catch (error) {
      message.showErrorWithLog('Erro ao carregar os temas.', error);
    }
  };

  const convertAndSetUsuarioForm = (usuario: Usuario) => {
    setUsuarioForm({
      username: usuario.username,
      currentPassword: '',
      newPassword: '',
      idTema: usuario.idTema,
    });
  };
  
  const handleSubmit = async () => {
    if (!usuarioForm) return;
  
    const { currentPassword, newPassword } = usuarioForm;
  
    if ((currentPassword || newPassword || confirmPassword) && 
        (!currentPassword || !newPassword || !confirmPassword)) {
      message.showError('Todos os campos de senha devem ser preenchidos.');
      return;
    }
  
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      message.showError('A nova senha e a confirmação não coincidem.');
      return;
    }
  
    if (!auth.usuario?.token) return;
  
    await UsuarioService.updateUsuario(auth.usuario.token, usuarioForm, message);
};


  const update = (updatedFields: Partial<UsuarioForm>) => {
    setUsuarioForm(prev => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return (
    <Container>
      <Loading isLoading={!usuarioForm}/>
      {usuarioForm && (
        <>
          <ActionButton
            icon={<FaCheck />}
            hint={'Salvar'}
            onClick={handleSubmit} 
          />
          <Stack direction="column" style={{ padding: '20px' }}>
            <Stack direction="row">
              <ImagePicker
                icon={<MdCameraAlt size={20} />}
                imageUrl={imagemPerfil}
                onChange={(file) => update({ file })}
                isLoading={isLoadingImage}
                key={imagemPerfil} 
              />
            </Stack>

            <Panel>
              <Stack direction="column" divider="top">
                <FieldValue
                  type="STRING"
                  value={usuarioForm.username}
                  description="Nome"
                  editable={false}
                />
                <FieldValue
                  type="STRING"
                  value={usuarioForm.currentPassword}
                  description="Senha Atual"
                  onUpdate={(v) => update({ currentPassword: v })}
                  placeholder="Digite sua senha atual"
                />
                <FieldValue
                  type="STRING"
                  value={usuarioForm.newPassword}
                  description="Nova Senha"
                  onUpdate={(v) => update({ newPassword: v })}
                  placeholder="Digite sua nova senha"
                />
                <FieldValue
                  type="STRING"
                  value={confirmPassword}
                  description="Confirmar Nova Senha"
                  onUpdate={setConfirmPassword}
                  placeholder="Confirme sua nova senha"
                />
              </Stack>
            </Panel>

            <Panel title="Temas" transparent style={{ marginTop: '20px' }}>
              <ThemeSelector
                themes={temas}
                currentTheme={usuarioForm.idTema}
                onThemeChange={(idTema) => update({ idTema })}
              />
            </Panel>
          </Stack>
        </>  
      )}
    </Container>
  );
};

export default UsuarioFormPage;
