import { AnapseGameSpec, SpecValidationResult } from '../types/anapseGameSpec';

export function validateAnapseGameSpec(jsonStringOrObj: string | object): SpecValidationResult {
  let spec: any;
  const checks: SpecValidationResult['checks'] = [];

  try {
    spec = typeof jsonStringOrObj === 'string' ? JSON.parse(jsonStringOrObj) : jsonStringOrObj;
  } catch (e) {
    return {
      isValid: false,
      score: 0,
      checks: [
        {
          id: 'json-valid',
          title: 'Sintaxis JSON',
          status: 'fail',
          message: 'El archivo anapse-game.json no tiene un formato JSON válido.',
        },
      ],
    };
  }

  checks.push({
    id: 'json-valid',
    title: 'Sintaxis JSON',
    status: 'pass',
    message: 'Estructura JSON válida.',
  });

  // 1. Check gameId & name
  if (spec.gameId && typeof spec.gameId === 'string' && spec.gameId.length > 0) {
    if (/^[a-z0-9-]+$/.test(spec.gameId)) {
      checks.push({
        id: 'game-id',
        title: 'Identificador único (gameId)',
        status: 'pass',
        message: `ID válido: "${spec.gameId}" (slug seguro).`,
      });
    } else {
      checks.push({
        id: 'game-id',
        title: 'Identificador único (gameId)',
        status: 'warn',
        message: `ID "${spec.gameId}" contiene caracteres especiales. Se recomienda kebab-case (ej: fox-thief).`,
      });
    }
  } else {
    checks.push({
      id: 'game-id',
      title: 'Identificador único (gameId)',
      status: 'fail',
      message: 'Falta la propiedad obligatoria "gameId".',
    });
  }

  if (spec.name && typeof spec.name === 'string') {
    checks.push({
      id: 'game-name',
      title: 'Nombre del Juego',
      status: 'pass',
      message: `Nombre detectado: "${spec.name}".`,
    });
  } else {
    checks.push({
      id: 'game-name',
      title: 'Nombre del Juego',
      status: 'fail',
      message: 'Falta el nombre público del juego ("name").',
    });
  }

  // 2. Version
  if (spec.version) {
    checks.push({
      id: 'version',
      title: 'Versión del Manifiesto',
      status: 'pass',
      message: `Versión del juego: ${spec.version}`,
    });
  } else {
    checks.push({
      id: 'version',
      title: 'Versión del Manifiesto',
      status: 'warn',
      message: 'Se recomienda definir "version": "1.0.0".',
    });
  }

  // 3. Web URL & Embed
  if (spec.web && spec.web.url) {
    checks.push({
      id: 'web-url',
      title: 'Despliegue Web / URL',
      status: 'pass',
      message: `URL configurada: ${spec.web.url}`,
    });
  } else {
    checks.push({
      id: 'web-url',
      title: 'Despliegue Web / URL',
      status: 'warn',
      message: 'No se especificó URL web para jugar en línea.',
    });
  }

  // 4. Repository
  if (spec.repository && spec.repository.owner && spec.repository.name) {
    checks.push({
      id: 'repo',
      title: 'Repositorio Conectado',
      status: 'pass',
      message: `Repositorio: ${spec.repository.owner}/${spec.repository.name} (rama: ${spec.repository.branch || 'main'})`,
    });
  } else {
    checks.push({
      id: 'repo',
      title: 'Repositorio Conectado',
      status: 'warn',
      message: 'No se ha enlazado el repositorio GitHub.',
    });
  }

  // 5. Firebase Configuration
  if (spec.firebase && spec.firebase.projectId) {
    checks.push({
      id: 'firebase',
      title: 'Firebase del Juego',
      status: 'pass',
      message: `Proyecto Firebase individual: "${spec.firebase.projectId}" (${spec.firebase.databaseType || 'firestore'}).`,
    });
  } else {
    checks.push({
      id: 'firebase',
      title: 'Firebase del Juego',
      status: 'warn',
      message: 'No cuenta con Firebase individual configurado. Se usará el portal central.',
    });
  }

  // 6. Collections
  if (spec.collections) {
    const declared = Object.keys(spec.collections).filter((k) => !!spec.collections[k]);
    if (declared.length > 0) {
      checks.push({
        id: 'collections',
        title: 'Colecciones Declaradas',
        status: 'pass',
        message: `Colecciones detectadas: ${declared.join(', ')}`,
      });
    } else {
      checks.push({
        id: 'collections',
        title: 'Colecciones Declaradas',
        status: 'warn',
        message: 'No se declararon colecciones personalizadas.',
      });
    }
  } else {
    checks.push({
      id: 'collections',
      title: 'Colecciones Declaradas',
      status: 'warn',
      message: 'No se definió objeto "collections".',
    });
  }

  // 7. Ranking System
  if (spec.ranking && spec.ranking.enabled) {
    checks.push({
      id: 'ranking',
      title: 'Sistema de Ranking',
      status: 'pass',
      message: `Ranking activado por ${spec.ranking.type || 'puntuación'} (campo: ${spec.ranking.scoreField || 'score'}).`,
    });
  } else {
    checks.push({
      id: 'ranking',
      title: 'Sistema de Ranking',
      status: 'warn',
      message: 'Ranking no activado en el manifiesto.',
    });
  }

  // 8. Features
  if (spec.features) {
    checks.push({
      id: 'features',
      title: 'Características Comunitarias',
      status: 'pass',
      message: `Módulos habilitados: ${Object.entries(spec.features)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(', ')}`,
    });
  } else {
    checks.push({
      id: 'features',
      title: 'Características Comunitarias',
      status: 'warn',
      message: 'Se recomienda definir "features": { "ranking": true, "likes": true, "comments": true, ... }',
    });
  }

  // Calculate score
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const score = Math.max(0, Math.round((passCount / checks.length) * 100) - failCount * 20);

  return {
    isValid: failCount === 0,
    score,
    checks,
    spec: spec as AnapseGameSpec,
  };
}
