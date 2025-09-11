import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ServicoCategoria } from '../../types';
import { getIconByName } from '../../utils';

interface ServicoCategoriaIconProps {
  servicoCategoria: ServicoCategoria;
}

const ServicoCategoriaIcon: React.FC<ServicoCategoriaIconProps> = ({ servicoCategoria }) => {
    const iconName = servicoCategoria.icone;
    
    const iconDefinition = getIconByName(iconName);
    
    return (
      <div>
        {iconDefinition ? (
            <FontAwesomeIcon icon={iconDefinition} />
        ) : (
            <span>Ícone não encontrado</span>
        )}
      </div>
    );
};

export default ServicoCategoriaIcon;
