import { IUser } from './User';
import user from './User';
// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


// **** Types **** //

export interface IMapa {
  id: number;
  name: string;
  valores: [];
  photo: string;
  likes: number;
  creator: IUser;
  categoria: string;
}


// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  name?: string,
  valores?: [],
  photo?: string,
  likes?: number,
  creator?: IUser,
  categoria?: string,
  id?: number, // id last cause usually set by db
): IMapa {
  return {
    id: (id ?? -1),
    name: (name ?? ''),
    photo: (photo ?? ''),
    likes: (likes ?? 0),
    creator: (creator ?? {id: -1, username: '', email: '', password: ''}),
    valores: (valores ?? []),
    categoria: (categoria ?? ''),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IMapa {
  if (!isMapa(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  if('valores' in param && typeof param.valores === 'string'){
    param.valores = JSON.parse(param.valores);
  }
  const p = param as IMapa;
  return new_(p.name, p.valores,p.photo,p.likes, p.creator, p.categoria, p.id);
}

/**
 * See if the param meets criteria to be a user.
 */
function isMapa(arg: unknown): boolean {
  console.log( "Is Mapa: ", !!arg && typeof arg === 'object');
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg && typeof arg.id === 'number' && 
    'photo' in arg && typeof arg.photo === 'string' && 
    'name' in arg && typeof arg.name === 'string' &&
    'likes' in arg && typeof arg.likes === 'number' &&
    'creator' in arg && user.isUser(arg.creator) &&
    'valores' in arg && typeof arg.valores === 'string'
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isMapa,
} as const;
